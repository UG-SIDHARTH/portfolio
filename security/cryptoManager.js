const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 128 bits for AES-GCM IV
const SALT_LENGTH = 32;

class CryptoManager {
    constructor() {
        this.masterKey = this._initMasterKey();
    }

    /**
     * Initializes or loads the 256-bit encryption key.
     * Uses DATA_ENCRYPTION_KEY environment variable if available,
     * otherwise generates/persists a local master key file in data/.key.
     */
    _initMasterKey() {
        const envKey = process.env.DATA_ENCRYPTION_KEY;
        if (envKey && envKey.trim().length > 0) {
            return crypto.createHash('sha256').update(envKey.trim()).digest();
        }

        const keyPath = path.join(__dirname, '..', 'data', '.key');
        try {
            if (fs.existsSync(keyPath)) {
                const keyHex = fs.readFileSync(keyPath, 'utf8').trim();
                if (keyHex.length === 64) {
                    return Buffer.from(keyHex, 'hex');
                }
            }

            // Generate secure 32-byte (256-bit) random key
            const newKey = crypto.randomBytes(32);
            const dataDir = path.dirname(keyPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(keyPath, newKey.toString('hex'), { mode: 0o600 });
            return newKey;
        } catch (err) {
            console.error('[CryptoManager] Error reading/writing local master key file:', err.message);
            // Fallback to volatile process key if filesystem fails
            return crypto.createHash('sha256').update('portfolio_fallback_secret_key_' + process.pid).digest();
        }
    }

    /**
     * Calculates HMAC-SHA256 signature for data verification and anti-tampering.
     */
    calculateHMAC(dataString) {
        return crypto.createHmac('sha256', this.masterKey).update(dataString).digest('hex');
    }

    /**
     * Encrypts plaintext payload using AES-256-GCM and generates an HMAC signature.
     * @param {string|object} payload Data to encrypt
     * @returns {object} Encrypted envelope containing ciphertext, iv, authTag, and hmac
     */
    encrypt(payload) {
        const plaintext = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const iv = crypto.randomBytes(IV_LENGTH);

        const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv);
        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');
        const ivHex = iv.toString('hex');

        const hmacPayload = `${ivHex}:${authTag}:${ciphertext}`;
        const hmac = this.calculateHMAC(hmacPayload);

        return {
            version: '1.0-aes256gcm',
            iv: ivHex,
            authTag: authTag,
            ciphertext: ciphertext,
            hmac: hmac,
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Decrypts AES-256-GCM envelope payload after verifying HMAC signature & auth tag.
     * @param {object} encryptedEnvelope The envelope object containing iv, authTag, ciphertext, hmac
     * @returns {string|object} Decrypted data
     */
    decrypt(encryptedEnvelope) {
        if (!encryptedEnvelope || typeof encryptedEnvelope !== 'object') {
            throw new Error('Invalid encrypted payload structure.');
        }

        const { iv, authTag, ciphertext, hmac } = encryptedEnvelope;

        if (!iv || !authTag || !ciphertext || !hmac) {
            throw new Error('Missing required encryption envelope parameters.');
        }

        // 1. Verify HMAC Signature (Tamper Check)
        const hmacPayload = `${iv}:${authTag}:${ciphertext}`;
        const expectedHmac = this.calculateHMAC(hmacPayload);

        const hmacBuffer = Buffer.from(hmac, 'hex');
        const expectedBuffer = Buffer.from(expectedHmac, 'hex');

        if (hmacBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(hmacBuffer, expectedBuffer)) {
            throw new Error('Data integrity compromise detected: HMAC validation failed.');
        }

        // 2. Decrypt Ciphertext with Auth Tag Verification
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            this.masterKey,
            Buffer.from(iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    }
}

module.exports = new CryptoManager();

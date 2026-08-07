require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const cryptoManager = require('./security/cryptoManager');

const app = express();
const PORT = process.env.PORT || 3500;

// Data directory & encrypted storage path
const DATA_DIR = path.join(__dirname, 'data');
const ENCRYPTED_MESSAGES_FILE = path.join(DATA_DIR, 'messages.enc');
const LEGACY_MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure data directory exists on startup
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 1. HTTP Security Headers via Helmet
app.use(
    helmet({
        contentSecurityPolicy: false, // Preserves Google Fonts & WebOS dynamic styling
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

// 2. Strict Production CORS Policy
const allowedOrigins = [
    'https://ugsidharth.in',
    'https://www.ugsidharth.in',
    'http://localhost:8601',
    'http://127.0.0.1:8601',
    'http://localhost:3500',
    'http://localhost:8500',
    'http://127.0.0.1:3500',
    'http://127.0.0.1:8500'
];

if (process.env.ALLOWED_ORIGIN) {
    allowedOrigins.push(process.env.ALLOWED_ORIGIN);
}

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
                return callback(null, true);
            } else {
                return callback(new Error('CORS policy restricted access from this origin.'));
            }
        },
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-API-Key']
    })
);

app.use(express.json({ limit: '50kb' }));

// 3. Security Middleware: Block public access to sensitive directories & files
app.use((req, res, next) => {
    const reqPath = req.path.toLowerCase();
    if (
        reqPath.startsWith('/data') ||
        reqPath.startsWith('/security') ||
        reqPath.endsWith('.env') ||
        reqPath.endsWith('.enc') ||
        reqPath.endsWith('.key') ||
        reqPath.endsWith('.json') ||
        reqPath.endsWith('.md') ||
        reqPath.endsWith('.yml') ||
        reqPath.startsWith('/.git')
    ) {
        return res.status(403).json({ error: '403 Forbidden: Access to restricted storage path denied.' });
    }
    next();
});

// Serve ONLY the dedicated /public folder containing static assets
app.use(express.static(PUBLIC_DIR));

// Helper: Read & decrypt stored messages (handles migration from legacy plain text file if needed)
async function readEncryptedMessages() {
    let messages = [];

    // Migrate legacy plaintext file if present
    if (fs.existsSync(LEGACY_MESSAGES_FILE) && !fs.existsSync(ENCRYPTED_MESSAGES_FILE)) {
        try {
            const rawLegacy = await fs.promises.readFile(LEGACY_MESSAGES_FILE, 'utf8');
            const parsedLegacy = JSON.parse(rawLegacy);
            if (Array.isArray(parsedLegacy)) {
                messages = parsedLegacy;
                await saveEncryptedMessages(messages);
                console.log('[Security] Legacy messages migrated to AES-256-GCM encrypted storage.');
                await fs.promises.unlink(LEGACY_MESSAGES_FILE);
            }
        } catch (migErr) {
            console.error('[Security] Legacy message migration error:', migErr.message);
        }
        return messages;
    }

    if (!fs.existsSync(ENCRYPTED_MESSAGES_FILE)) {
        return [];
    }

    try {
        const rawEnvelope = await fs.promises.readFile(ENCRYPTED_MESSAGES_FILE, 'utf8');
        const envelopeObj = JSON.parse(rawEnvelope);
        messages = cryptoManager.decrypt(envelopeObj);
        return Array.isArray(messages) ? messages : [];
    } catch (err) {
        console.error('[Security] Failed to decrypt encrypted messages payload:', err.message);
        return [];
    }
}

// Helper: Encrypt & save messages array to disk
async function saveEncryptedMessages(messagesArray) {
    const envelope = cryptoManager.encrypt(messagesArray);
    await fs.promises.writeFile(ENCRYPTED_MESSAGES_FILE, JSON.stringify(envelope, null, 2), 'utf8');
}

// 4. Rate Limiter for Contact API (5 requests / 15 mins)
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded. Please wait 15 minutes before sending another message.' }
});

// 5. Rate Limiter for Admin API (10 requests / 15 mins)
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Admin rate limit exceeded. Access throttled.' }
});

// Timing-safe admin authentication middleware
function authenticateAdmin(req, res, next) {
    const adminKey = process.env.ADMIN_SECRET_KEY;
    if (!adminKey || adminKey.trim().length === 0) {
        return res.status(500).json({ error: 'Admin authentication key not configured on server.' });
    }

    const providedKey = req.headers['x-admin-api-key'] ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null);

    if (!providedKey) {
        return res.status(401).json({ error: '401 Unauthorized: Missing Admin API Key.' });
    }

    const adminBuffer = Buffer.from(adminKey.trim());
    const providedBuffer = Buffer.from(providedKey.trim());

    if (adminBuffer.length !== providedBuffer.length || !crypto.timingSafeEqual(adminBuffer, providedBuffer)) {
        return res.status(403).json({ error: '403 Forbidden: Invalid Admin API Key.' });
    }

    next();
}

// HTML sanitization helper function
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// 6. Public Contact API Endpoint (Encrypts incoming data at rest)
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
        }

        if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid payload data type.' });
        }

        if (name.trim().length > 100 || subject.trim().length > 100 || message.trim().length > 2000 || email.trim().length > 100) {
            return res.status(400).json({ error: 'Input field length limit exceeded.' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Invalid email address format.' });
        }

        const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        if (scriptPattern.test(name) || scriptPattern.test(subject) || scriptPattern.test(message)) {
            return res.status(400).json({ error: 'HTML / Script tags are not allowed.' });
        }

        const newMessage = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: sanitizeString(name.trim()),
            email: sanitizeString(email.trim()),
            subject: sanitizeString(subject.trim()),
            message: sanitizeString(message.trim()),
            timestamp: new Date().toISOString()
        };

        const messages = await readEncryptedMessages();
        messages.push(newMessage);
        await saveEncryptedMessages(messages);

        return res.status(200).json({ success: true, message: 'Message encrypted & recorded securely.' });
    } catch (error) {
        console.error('API Contact Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// 7. Secure Admin Endpoint: GET /api/admin/messages
app.get('/api/admin/messages', adminLimiter, authenticateAdmin, async (req, res) => {
    try {
        const messages = await readEncryptedMessages();
        return res.status(200).json({
            success: true,
            count: messages.length,
            messages: messages
        });
    } catch (err) {
        console.error('[Admin API] Error fetching messages:', err);
        return res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});

// 8. Secure Admin Endpoint: DELETE /api/admin/messages/:id
app.delete('/api/admin/messages/:id', adminLimiter, authenticateAdmin, async (req, res) => {
    try {
        const messageId = req.params.id;
        let messages = await readEncryptedMessages();

        const initialLength = messages.length;
        messages = messages.filter(m => m.id !== messageId);

        if (messages.length === initialLength) {
            return res.status(404).json({ error: 'Message not found.' });
        }

        await saveEncryptedMessages(messages);
        return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (err) {
        console.error('[Admin API] Error deleting message:', err);
        return res.status(500).json({ error: 'Failed to delete message.' });
    }
});

// Fallback to /public/index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`OS backend running securely on port ${PORT}`);
    console.log(`Serving static files exclusively from ${PUBLIC_DIR}`);
    console.log(`Data security status: AES-256-GCM encryption & HMAC integrity active`);
});

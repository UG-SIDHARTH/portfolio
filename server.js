const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3500;

// Data directory & file storage outside public web root
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
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
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(express.json({ limit: '50kb' }));

// 3. Security Middleware: Block public requests to data files, dotfiles, and config files
app.use((req, res, next) => {
    const reqPath = req.path.toLowerCase();
    if (reqPath.startsWith('/data') || reqPath.endsWith('.json') || reqPath.endsWith('.md') || reqPath.endsWith('.yml') || reqPath.startsWith('/.git')) {
        return res.status(403).json({ error: '403 Forbidden: Access to file is restricted.' });
    }
    next();
});

// Serve ONLY the dedicated /public folder containing web assets
app.use(express.static(PUBLIC_DIR));

// 4. Anti-Spam Rate Limiter for Contact API
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit 5 requests per 15 min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded. Please wait 15 minutes before sending another message.' }
});

// HTML sanitization helper function to prevent stored XSS
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

// 5. Secure Contact API Endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        // Field Presence Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields (name, email, subject, message) are required.' });
        }

        // Data Type Validation
        if (typeof name !== 'string' || typeof email !== 'string' || typeof subject !== 'string' || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid payload data type.' });
        }

        // Enforce Strict Field Length Limits (name ≤100, subject ≤100, message ≤2000)
        if (name.trim().length > 100 || subject.trim().length > 100 || message.trim().length > 2000 || email.trim().length > 100) {
            return res.status(400).json({ error: 'Input field length limit exceeded.' });
        }

        // Email Format Regex Validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: 'Invalid email address format.' });
        }

        // Reject Script Tags or Suspicious Script Injections
        const scriptPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        if (scriptPattern.test(name) || scriptPattern.test(subject) || scriptPattern.test(message)) {
            return res.status(400).json({ error: 'HTML / Script tags are not allowed.' });
        }

        // Construct Sanitized Contact Payload
        const newMessage = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: sanitizeString(name.trim()),
            email: sanitizeString(email.trim()),
            subject: sanitizeString(subject.trim()),
            message: sanitizeString(message.trim()),
            timestamp: new Date().toISOString()
        };

        // Read existing messages securely from /data/messages.json
        let messages = [];
        try {
            if (fs.existsSync(MESSAGES_FILE)) {
                const fileData = await fs.promises.readFile(MESSAGES_FILE, 'utf8');
                messages = JSON.parse(fileData);
                if (!Array.isArray(messages)) messages = [];
            }
        } catch (readErr) {
            console.error('Error reading data log file:', readErr);
            messages = [];
        }

        // Append and save securely
        messages.push(newMessage);
        await fs.promises.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');

        return res.status(200).json({ success: true, message: 'Message recorded securely.' });
    } catch (error) {
        console.error('API Contact Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Fallback to /public/index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`OS backend running on port ${PORT}`);
    console.log(`Serving static files exclusively from ${PUBLIC_DIR}`);
});

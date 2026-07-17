const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3500;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(__dirname));

// Secure Endpoint for Contact Messages (saves to messages.json securely on server filesystem)
app.post('/api/contact', (e, res) => {
    try {
        const { name, email, subject, message } = e.body;

        // Basic inputs validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        // Message object
        const newMessage = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString()
        };

        // Read existing messages
        let messages = [];
        if (fs.existsSync(MESSAGES_FILE)) {
            const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
            try {
                messages = JSON.parse(fileData);
            } catch (err) {
                console.error('Error parsing messages.json:', err);
                messages = [];
            }
        }

        // Append and write securely
        messages.push(newMessage);
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');

        return res.status(200).json({ success: true, message: 'Message recorded securely.' });
    } catch (error) {
        console.error('API Contact Error:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});



// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`OS backend running on port ${PORT}`);
    console.log(`Servicing files at http://localhost:${PORT}`);
});

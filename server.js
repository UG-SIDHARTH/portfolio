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

// GET Route to serve portfolio resume data
app.get('/api/data', (req, res) => {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        if (fs.existsSync(dataPath)) {
            const data = fs.readFileSync(dataPath, 'utf8');
            return res.status(200).json(JSON.parse(data));
        }
        return res.status(404).json({ error: 'Data file not found.' });
    } catch (err) {
        console.error('API Data Error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET Route to serve sanitized files for the mock VS Code editor
app.get('/api/code', (req, res) => {
    try {
        const { file } = req.query;
        let filePath = '';

        if (file === 'resume') {
            filePath = path.join(__dirname, 'data.json');
        } else if (file === 'index') {
            filePath = path.join(__dirname, 'index.html');
        } else if (file === 'script') {
            filePath = path.join(__dirname, 'script.js');
        } else if (file === 'styles') {
            filePath = path.join(__dirname, 'styles.css');
        } else {
            return res.status(400).json({ error: 'Invalid file parameter.' });
        }

        if (fs.existsSync(filePath)) {
            let code = fs.readFileSync(filePath, 'utf8');
            
            // Convert special HTML entities to safe strings
            code = code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            // Syntax highlighting regex mappings on the server
            if (file === 'resume') {
                code = code
                    .replace(/(&quot;[^&]+&quot;)(?=\s*:)/g, '<span class="code-keyword">$1</span>')
                    .replace(/:(\s*&quot;[^&]*&quot;)/g, ': <span class="code-string">$1</span>')
                    .replace(/:(\s*\d+(\.\d+)?)/g, ': <span class="code-number">$1</span>');
            } else if (file === 'index') {
                code = code
                    .replace(/&lt;(\/?[a-zA-Z0-9\-]+)/g, '&lt;<span class="code-tag">$1</span>')
                    .replace(/([a-zA-Z0-9\-]+)=(&quot;[^&]*&quot;)/g, '<span class="code-attr">$1</span>=<span class="code-string">$2</span>');
            } else if (file === 'script') {
                code = code
                    .replace(/\b(const|let|var|function|return|if|else|for|forEach|switch|case|break|document|window)\b/g, '<span class="code-keyword">$1</span>')
                    .replace(/(&quot;[^&]*&quot;|&apos;[^&]*&apos;)/g, '<span class="code-string">$1</span>')
                    .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>');
            } else if (file === 'styles') {
                code = code
                    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>')
                    .replace(/([a-zA-Z0-9\-\#\.\:\s]+)(?=\s*\{)/g, '<span class="code-tag">$1</span>')
                    .replace(/([a-zA-Z0-9\-]+):(\s*[^;\}]+);/g, '<span class="code-attr">$1</span>: <span class="code-string">$2</span>;');
            }

            return res.status(200).send(code);
        }
        return res.status(404).json({ error: 'Code file not found.' });
    } catch (err) {
        console.error('API Code Error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`SidharthOS backend running on port ${PORT}`);
    console.log(`Servicing files at http://localhost:${PORT}`);
});

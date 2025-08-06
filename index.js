const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/api/message', (req, res) => {
    const payload = req.body;
    const filename = `${payload.from}.json`;
    
    let data = [];
    if (fs.existsSync(filename)) {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    
    payload.timestamp = new Date().toISOString();
    data.push(payload);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    
    res.json({ success: true });
});

app.get('/api/emails/:from', (req, res) => {
    const filename = `${req.params.from}.json`;
    
    if (!fs.existsSync(filename)) {
        return res.json([]);
    }
    
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    res.json(sorted);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
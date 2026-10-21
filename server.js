const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Ensure data.json exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ categories: [], campaigns: [], orders: [] }));
}

// API: Get Data
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });
        const parsed = JSON.parse(data);
        if (!parsed.orders) parsed.orders = [];
        res.json(parsed);
    });
});

// API: Save Data (Admin only - entire tree)
app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Failed to save data" });
        res.json({ message: "Data saved successfully" });
    });
});

// API: Make Order (Guest usage)
app.post('/api/order', (req, res) => {
    const newOrder = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });
        const parsed = JSON.parse(data);
        if (!parsed.orders) parsed.orders = [];
        newOrder.id = Date.now();
        newOrder.date = new Date().toLocaleString('tr-TR');
        parsed.orders.push(newOrder);
        
        fs.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Failed to save order" });
            res.json({ message: "Siparişiniz başarıyla alındı!" });
        });
    });
});

// Serve the index.html for any unknown route (SPA style)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 İHSAN MOBİLYA Sunucusu Başlatıldı!`);
    console.log(`🌐 Yerel Erişim: http://localhost:${PORT}`);
    console.log(`🔗 Ağ Erişimi: http://[PC_IP_ADRESINIZ]:${PORT}\n`);
    console.log(`--------------------------------------------------`);
    console.log(`👉 Dünyaya açmak için şu komutu başka bir terminalde çalıştırın:`);
    console.log(`   npx localtunnel --port ${PORT}\n`);
});

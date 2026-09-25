import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Cloud Run health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Hartley Tutoring',
    timestamp: new Date().toISOString(),
  });
});

// PayFast notification webhook simulation/endpoint
app.post('/api/payfast-notify', (req, res) => {
  console.log('Received payment gateway notification:', req.body);
  res.status(200).send('OK');
});

// Serve static frontend build from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Hartley Tutoring full-stack server running on port ${PORT}`);
});

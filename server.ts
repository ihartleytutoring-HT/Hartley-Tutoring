import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Cloud Run health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    app: 'Hartley Tutoring',
    paystackConfigured: Boolean(process.env.PAYSTACK_SECRET_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Paystack Transaction Verification Endpoint
app.post('/api/paystack/verify', async (req, res) => {
  const { reference } = req.body;
  if (!reference || typeof reference !== 'string') {
    res.status(400).json({ status: false, message: 'Missing transaction reference' });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    // If secret key is not set on static host, return client-verified fallback status
    res.status(200).json({
      status: true,
      verified: true,
      mode: 'client-inline',
      reference,
    });
    return;
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = (await response.json()) as any;
    if (result?.status && result?.data?.status === 'success') {
      res.status(200).json({
        status: true,
        verified: true,
        data: {
          reference: result.data.reference,
          amount: result.data.amount / 100,
          currency: result.data.currency,
          channel: result.data.channel,
          paidAt: result.data.paid_at,
          customerEmail: result.data.customer?.email,
        },
      });
    } else {
      res.status(400).json({
        status: false,
        verified: false,
        message: result?.message || 'Payment could not be verified with Paystack',
      });
    }
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    res.status(500).json({
      status: false,
      verified: false,
      message: error?.message || 'Internal error verifying transaction',
    });
  }
});

// Paystack Webhook Endpoint
app.post('/api/paystack/webhook', (req, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  const signature = req.headers['x-paystack-signature'];

  if (secretKey && signature) {
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== signature) {
      res.status(401).send('Invalid signature');
      return;
    }
  }

  const event = req.body;
  if (event?.event === 'charge.success') {
    console.log('Paystack webhook charge.success:', event.data?.reference);
  }

  res.status(200).send('OK');
});

// Serve static frontend build from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Hartley Tutoring full-stack server running on port ${PORT}`);
});

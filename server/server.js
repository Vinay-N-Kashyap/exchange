import express from 'express';
import cors from 'cors';
import { initDatabase } from './database.js';

import authRoutes from './routes/auth.js';
import hubRoutes from './routes/hub.js';
import listingsRoutes from './routes/listings.js';
import ordersRoutes from './routes/orders.js';
import creatorRoutes from './routes/creator.js';
import requirementsRoutes from './routes/requirements.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Route Bindings
app.use('/api/auth', authRoutes);
app.use('/api/hub', hubRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/requirements', requirementsRoutes);

// System Health & Platform Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'PinIT Exchange Backend Engine',
    hub_link_status: 'connected',
    sealed_ledger: 'active_tamper_proof',
    timestamp: new Date().toISOString()
  });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 PinIT Exchange Server running on http://localhost:${PORT}`);
      console.log(`🔒 Connected to PinIT Hub Vault & Provenance Ledger`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

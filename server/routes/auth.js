import express from 'express';
import db from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get current logged-in user profile (Default: Elena Rostova / PINIT-90481234)
router.get('/me', (req, res) => {
  const pinitId = req.query.pinit_id || 'PINIT-90481234';
  db.get("SELECT * FROM users WHERE pinit_id = ?", [pinitId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });
});

// Update Profile / Seller Onboarding
router.post('/onboard-seller', (req, res) => {
  const { pinit_id, name, email, bio, seller_plan } = req.body;
  const targetId = pinit_id || 'PINIT-90481234';
  
  // Mint an Exchange ID if not already minted
  const exchangeId = 'PX-' + Math.floor(100000 + Math.random() * 900000);

  db.run(`
    UPDATE users 
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        bio = COALESCE(?, bio),
        seller_plan = COALESCE(?, seller_plan),
        kyc_status = 'verified',
        biometric_verified = 1,
        exchange_id = COALESCE(exchange_id, ?)
    WHERE pinit_id = ?
  `, [name, email, bio, seller_plan, exchangeId, targetId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    db.get("SELECT * FROM users WHERE pinit_id = ?", [targetId], (err, updatedUser) => {
      res.json({ message: "Seller onboarding completed successfully", user: updatedUser });
    });
  });
});

export default router;

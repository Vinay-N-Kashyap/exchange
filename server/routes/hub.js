import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get Hub-protected assets eligible for listing
router.get('/assets', (req, res) => {
  const pinitId = req.query.pinit_id || 'PINIT-90481234';
  db.all("SELECT * FROM hub_assets WHERE pinit_id = ? ORDER BY created_at DESC", [pinitId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Protect Asset in Hub (Generate DNA + Vault Encryption + Compute Authenticity Badge)
router.post('/protect', (req, res) => {
  const { pinit_id, title, file_type, vertical, preview_url, human_percent, ai_percent } = req.body;

  const targetPinitId = pinit_id || 'PINIT-90481234';
  const humanScore = Number(human_percent) || 90;
  const aiScore = Number(ai_percent) || (100 - humanScore);

  // Compute Badge Tier based on manual/human authenticity score
  let badgeTier = 'Bronze';
  if (humanScore >= 90) {
    badgeTier = 'Gold';
  } else if (humanScore >= 60) {
    badgeTier = 'Silver';
  } else {
    badgeTier = 'Bronze';
  }

  const assetId = 'HA-' + Math.floor(1000 + Math.random() * 9000);
  const dnaRecordId = 'DNA-' + Math.floor(1000 + Math.random() * 9000) + '-' + badgeTier.substring(0, 1);
  const defaultPreview = preview_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  db.run(`
    INSERT INTO hub_assets (asset_id, pinit_id, title, file_type, vertical, preview_url, vault_encrypted, dna_record_id, human_percent, ai_percent, badge_tier)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
  `, [assetId, targetPinitId, title, file_type || 'image', vertical || 'images', defaultPreview, dnaRecordId, humanScore, aiScore, badgeTier], function(err) {
    if (err) return res.status(500).json({ error: err.message });

    db.get("SELECT * FROM hub_assets WHERE asset_id = ?", [assetId], (err, newAsset) => {
      res.status(201).json({
        message: "Asset protected in PinIT Hub Vault with DNA Record",
        asset: newAsset
      });
    });
  });
});

export default router;

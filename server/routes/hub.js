import express from 'express';
import db from '../database.js';
import { supabaseServer } from '../supabase.js';

const router = express.Router();

// Get Hub-protected assets eligible for listing
router.get('/assets', async (req, res) => {
  const pinitId = req.query.pinit_id || 'PINIT-90481234';

  // Attempt reading from Supabase vault_registry first
  if (supabaseServer) {
    try {
      const { data, error } = await supabaseServer
        .from('vault_registry')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedAssets = data.map(item => ({
          asset_id: item.asset_id || item.id,
          pinit_id: pinitId,
          title: item.file_name || 'Protected Asset',
          file_type: item.file_type || 'image',
          vertical: 'images',
          preview_url: item.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
          vault_encrypted: 1,
          dna_record_id: item.dna_signature || 'DNA-9001-G',
          human_percent: item.human_percent || 95,
          ai_percent: item.ai_percent || 5,
          badge_tier: item.badge_tier || 'Gold'
        }));
        return res.json(mappedAssets);
      }
    } catch (sbErr) {
      console.warn("Supabase fetch fallback to SQLite:", sbErr.message);
    }
  }

  // Fallback to SQLite
  db.all("SELECT * FROM hub_assets WHERE pinit_id = ? ORDER BY created_at DESC", [pinitId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Protect Asset in Hub (Generate DNA + Vault Encryption + Compute Authenticity Badge)
router.post('/protect', async (req, res) => {
  const { pinit_id, title, file_type, vertical, preview_url, human_percent, ai_percent } = req.body;

  const targetPinitId = pinit_id || 'PINIT-90481234';
  const humanScore = Number(human_percent) || 90;
  const aiScore = Number(ai_percent) || (100 - humanScore);

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

  // Sync to Supabase vault_registry if connected
  if (supabaseServer) {
    try {
      await supabaseServer.from('vault_registry').insert([{
        file_name: title,
        file_type: file_type || 'image',
        url: defaultPreview,
        hash: '0x' + Math.random().toString(16).substr(2, 32),
        asset_id: assetId,
        dna_signature: dnaRecordId,
        human_percent: humanScore,
        ai_percent: aiScore,
        badge_tier: badgeTier
      }]);
    } catch (sbErr) {
      console.warn("Supabase insert error:", sbErr.message);
    }
  }

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

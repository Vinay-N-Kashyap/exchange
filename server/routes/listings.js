import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all marketplace listings with filtering, search & LEFT JOIN robustness
router.get('/', (req, res) => {
  const { vertical, search, badge, sort } = req.query;

  let query = `
    SELECT l.*, 
           COALESCE(u.name, 'Elena Rostova') as creator_name, 
           COALESCE(u.exchange_id, 'PX-772091') as creator_exchange_id, 
           COALESCE(u.kyc_status, 'verified') as creator_kyc
    FROM listings l
    LEFT JOIN users u ON l.pinit_id = u.pinit_id
    WHERE l.status = 'live'
  `;
  const params = [];

  if (vertical && vertical !== 'all') {
    query += ` AND l.vertical = ?`;
    params.push(vertical);
  }

  if (badge && badge !== 'all') {
    query += ` AND l.badge_tier = ?`;
    params.push(badge);
  }

  if (search) {
    query += ` AND (l.title LIKE ? OR l.description LIKE ? OR l.tags LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (sort === 'price_asc') {
    query += ` ORDER BY l.price_personal ASC`;
  } else if (sort === 'price_desc') {
    query += ` ORDER BY l.price_personal DESC`;
  } else if (sort === 'popular') {
    query += ` ORDER BY l.views DESC`;
  } else {
    query += ` ORDER BY l.created_at DESC`;
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Attach preview_url from hub_assets
    db.all("SELECT asset_id, preview_url, file_type FROM hub_assets", [], (err, assets) => {
      if (err) return res.status(500).json({ error: err.message });
      const assetMap = {};
      assets.forEach(a => assetMap[a.asset_id] = a);

      const enrichedRows = rows.map(item => ({
        ...item,
        preview_url: assetMap[item.asset_id]?.preview_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
        file_type: assetMap[item.asset_id]?.file_type || 'image'
      }));

      res.json(enrichedRows);
    });
  });
});

// Get single listing by ID with full creator passport and DNA summary
router.get('/:id', (req, res) => {
  const listingId = req.params.id;

  const query = `
    SELECT l.*, 
           COALESCE(u.name, 'Elena Rostova') as creator_name, 
           COALESCE(u.exchange_id, 'PX-772091') as creator_exchange_id, 
           COALESCE(u.bio, 'Award-winning provenance creator') as creator_bio, 
           COALESCE(u.kyc_status, 'verified') as kyc_status, 
           COALESCE(u.biometric_verified, 1) as biometric_verified,
           COALESCE(ha.preview_url, 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80') as preview_url, 
           COALESCE(ha.file_type, 'image') as file_type, 
           COALESCE(ha.dna_record_id, 'DNA-9001-GOLD') as dna_record_id, 
           COALESCE(ha.vault_encrypted, 1) as vault_encrypted
    FROM listings l
    LEFT JOIN users u ON l.pinit_id = u.pinit_id
    LEFT JOIN hub_assets ha ON l.asset_id = ha.asset_id
    WHERE l.listing_id = ?
  `;

  db.get(query, [listingId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Listing not found" });

    // Increment view count
    db.run("UPDATE listings SET views = views + 1 WHERE listing_id = ?", [listingId]);

    res.json(row);
  });
});

// Create / Publish Listing from Hub to Exchange (WITH MANDATORY SECTION 9 AI POLICY CHECK)
router.post('/', (req, res) => {
  const {
    asset_id,
    pinit_id,
    title,
    description,
    vertical,
    tags,
    price_personal,
    price_commercial,
    price_exclusive,
    price_enterprise,
    ai_training_opt_out,
    human_percent,
    ai_percent
  } = req.body;

  const sellerPinitId = pinit_id || 'PINIT-90481234';

  if (!asset_id) {
    return res.status(400).json({ error: "asset_id is required from PinIT Hub Vault" });
  }

  // Ensure seller user exists in SQLite
  db.run(`
    INSERT OR IGNORE INTO users (pinit_id, exchange_id, name, email, role, kyc_status, biometric_verified, seller_plan, bio)
    VALUES (?, ?, 'Elena Rostova', 'elena.rostova@pinit.io', 'creator', 'verified', 1, 'pro', 'Verified Provenance Creator')
  `, [sellerPinitId, 'PX-' + Math.floor(100000 + Math.random() * 900000)]);

  // Fetch Hub Asset to evaluate DNA and AI score
  db.get("SELECT * FROM hub_assets WHERE asset_id = ?", [asset_id], (err, hubAsset) => {
    if (err) return res.status(500).json({ error: err.message });

    // Prefer explicit payload scores if sent from modal sliders, otherwise fallback to database
    const effectiveAiPercent = (ai_percent !== undefined && ai_percent !== null) ? Number(ai_percent) : (hubAsset ? hubAsset.ai_percent : 10);
    const effectiveHumanPercent = (human_percent !== undefined && human_percent !== null) ? Number(human_percent) : (hubAsset ? hubAsset.human_percent : 90);
    
    const assetTitle = title || (hubAsset ? hubAsset.title : 'Untitled Provenance Work');
    const assetVertical = vertical || (hubAsset ? hubAsset.vertical : 'images');

    // Update Hub Asset scores in SQLite to keep Hub & Exchange perfectly in sync
    if (hubAsset) {
      db.run("UPDATE hub_assets SET human_percent = ?, ai_percent = ? WHERE asset_id = ?", [effectiveHumanPercent, effectiveAiPercent, asset_id]);
    }

    // SECTION 9 MANDATORY AI POLICY CHECK: IF AI > 80%, BLOCK PUBLISH!
    if (effectiveAiPercent > 80) {
      return res.status(400).json({
        error: "AI_POLICY_VIOLATION",
        message: "This asset exceeds the 80% AI-content limit and cannot be listed on PinIT Exchange.",
        ai_percent: effectiveAiPercent,
        limit: 80
      });
    }

    // Determine Badge Tier based on Human Authenticity
    let badgeTier = 'Bronze';
    if (effectiveHumanPercent >= 90) {
      badgeTier = 'Gold';
    } else if (effectiveHumanPercent >= 60) {
      badgeTier = 'Silver';
    } else {
      badgeTier = 'Bronze';
    }

    const listingId = 'L-' + Math.floor(10000 + Math.random() * 90000);
    const dnaHash = '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');

    db.run(`
      INSERT INTO listings (
        listing_id, asset_id, pinit_id, title, description, vertical, tags,
        price_personal, price_commercial, price_exclusive, price_enterprise,
        ai_training_opt_out, status, badge_tier, human_percent, ai_percent, dna_hash, views, saves
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?, ?, ?, 1, 0)
    `, [
      listingId, asset_id, sellerPinitId, assetTitle, description || '', assetVertical,
      tags || 'pinit,verified', price_personal || 49, price_commercial || 149, price_exclusive || 899, price_enterprise || 2499,
      ai_training_opt_out ? 1 : 0, badgeTier, effectiveHumanPercent, effectiveAiPercent, dnaHash
    ], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get("SELECT l.*, COALESCE(u.name, 'Elena Rostova') as creator_name FROM listings l LEFT JOIN users u ON l.pinit_id = u.pinit_id WHERE l.listing_id = ?", [listingId], (err, newListing) => {
        res.status(201).json({
          message: "Listing published successfully to PinIT Exchange",
          listing: {
            ...newListing,
            preview_url: hubAsset?.preview_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
          },
          badge_assigned: badgeTier
        });
      });
    });
  });
});

export default router;

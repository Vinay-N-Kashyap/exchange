import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'exchange.db');
const db = new sqlite3.Database(dbPath);

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          pinit_id TEXT PRIMARY KEY,
          exchange_id TEXT UNIQUE,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'creator',
          kyc_status TEXT DEFAULT 'verified',
          biometric_verified INTEGER DEFAULT 1,
          seller_plan TEXT DEFAULT 'pro',
          bio TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Hub Assets (Private Hub Vault)
      db.run(`
        CREATE TABLE IF NOT EXISTS hub_assets (
          asset_id TEXT PRIMARY KEY,
          pinit_id TEXT NOT NULL,
          title TEXT NOT NULL,
          file_type TEXT NOT NULL,
          vertical TEXT NOT NULL,
          preview_url TEXT,
          vault_encrypted INTEGER DEFAULT 1,
          dna_record_id TEXT NOT NULL,
          human_percent INTEGER NOT NULL,
          ai_percent INTEGER NOT NULL,
          badge_tier TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Exchange Listings
      db.run(`
        CREATE TABLE IF NOT EXISTS listings (
          listing_id TEXT PRIMARY KEY,
          asset_id TEXT NOT NULL,
          pinit_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          vertical TEXT NOT NULL,
          tags TEXT,
          price_personal REAL DEFAULT 49,
          price_commercial REAL DEFAULT 149,
          price_exclusive REAL DEFAULT 899,
          price_enterprise REAL DEFAULT 2499,
          ai_training_opt_out INTEGER DEFAULT 1,
          status TEXT DEFAULT 'live',
          badge_tier TEXT NOT NULL,
          human_percent INTEGER NOT NULL,
          ai_percent INTEGER NOT NULL,
          dna_hash TEXT NOT NULL,
          views INTEGER DEFAULT 142,
          saves INTEGER DEFAULT 18,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Sealed Sales Ledger
      db.run(`
        CREATE TABLE IF NOT EXISTS orders_sealed (
          seal_id TEXT PRIMARY KEY,
          order_id TEXT UNIQUE NOT NULL,
          listing_id TEXT NOT NULL,
          asset_id TEXT NOT NULL,
          seller_pinit_id TEXT NOT NULL,
          seller_exchange_id TEXT NOT NULL,
          buyer_pinit_id TEXT NOT NULL,
          buyer_name TEXT NOT NULL,
          buyer_email TEXT NOT NULL,
          buyer_org TEXT,
          license_tier TEXT NOT NULL,
          price_paid REAL NOT NULL,
          platform_fee REAL NOT NULL,
          creator_net REAL NOT NULL,
          dna_hash_summary TEXT NOT NULL,
          license_terms_version TEXT DEFAULT 'v2.1-provenance',
          status TEXT DEFAULT 'sealed',
          sealed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Requirements Exchange
      db.run(`
        CREATE TABLE IF NOT EXISTS requirements (
          req_id TEXT PRIMARY KEY,
          buyer_name TEXT NOT NULL,
          buyer_org TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          vertical TEXT NOT NULL,
          budget REAL NOT NULL,
          deadline TEXT NOT NULL,
          proposals_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'open',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Post-Sale Tracking Jobs
      db.run(`
        CREATE TABLE IF NOT EXISTS tracking_jobs (
          job_id TEXT PRIMARY KEY,
          seal_id TEXT NOT NULL,
          asset_id TEXT NOT NULL,
          seller_pinit_id TEXT NOT NULL,
          status TEXT DEFAULT 'active_monitoring',
          matches_found INTEGER DEFAULT 0,
          last_checked DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error("Database schema init error:", err);
          return reject(err);
        }
        seedInitialData()
          .then(resolve)
          .catch(reject);
      });
    });
  });
}

function seedInitialData() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
      if (err) return reject(err);
      if (row.count > 0) return resolve(); // Already seeded

      db.serialize(() => {
        // Seed Main Creator User
        db.run(`
          INSERT INTO users (pinit_id, exchange_id, name, email, role, kyc_status, biometric_verified, seller_plan, bio)
          VALUES ('PINIT-90481234', 'PX-772091', 'Elena Rostova', 'elena.rostova@pinit.io', 'creator', 'verified', 1, 'enterprise_pro', 'Award-winning architectural photographer and digital artist creating high-provenance visual assets.')
        `);

        db.run(`
          INSERT INTO users (pinit_id, exchange_id, name, email, role, kyc_status, biometric_verified, seller_plan, bio)
          VALUES ('PINIT-33109284', 'PX-441802', 'Marcus Vance', 'marcus.vance@studio.io', 'creator', 'verified', 1, 'pro', 'Cinematographer & 3D Environment Designer specializing in verified virtual production.')
        `);

        // Seed Hub Assets (Protected in Hub Vault)
        const hubAssets = [
          ['HA-9001', 'PINIT-90481234', 'Cybernetic Neo-Tokyo Architecture', 'image', 'images', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9001-A', 95, 5, 'Gold'],
          ['HA-9002', 'PINIT-90481234', 'Nordic Fjord Drone Survey 8K', 'video', 'video', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9002-B', 98, 2, 'Gold'],
          ['HA-9003', 'PINIT-90481234', 'Quantum Computing Core UI Component System', 'ui_ux', 'ui_ux', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9003-C', 75, 25, 'Silver'],
          ['HA-9004', 'PINIT-33109284', 'Biomechanical Sculptural Asset 3D', '3d', '3d', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9004-D', 88, 12, 'Silver'],
          ['HA-9005', 'PINIT-33109284', 'Synthwave Soundscapes Audio Suite', 'audio', 'audio', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', 1, 'DNA-9005-E', 55, 45, 'Bronze']
        ];

        hubAssets.forEach(asset => {
          db.run(`
            INSERT INTO hub_assets (asset_id, pinit_id, title, file_type, vertical, preview_url, vault_encrypted, dna_record_id, human_percent, ai_percent, badge_tier)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, asset);
        });

        // Seed Listings on Exchange
        const listings = [
          ['L-101', 'HA-9001', 'PINIT-90481234', 'Cybernetic Neo-Tokyo Architecture', 'Hyper-detailed futuristic cityscape photographed under blue twilight, protected with SHA256 camera sensor DNA.', 'images', 'cyberpunk,architecture,tokyo,night', 79, 249, 1299, 3499, 1, 'live', 'Gold', 95, 5, '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', 342, 45],
          ['L-102', 'HA-9002', 'PINIT-90481234', 'Nordic Fjord Drone Survey 8K', 'Raw 8K footage captured with Hasselblad sensor aerial drone. Complete copyright provenance certificate attached.', 'video', 'drone,fjord,nature,8k', 129, 399, 1899, 4999, 1, 'live', 'Gold', 98, 2, '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', 289, 38],
          ['L-103', 'HA-9003', 'PINIT-90481234', 'Quantum Computing Core UI Component System', 'Modern glassmorphic dashboard component framework designed for Web3 & enterprise AI consoles.', 'ui_ux', 'ui,react,dashboard,design-system', 59, 189, 899, 2299, 1, 'live', 'Silver', 75, 25, '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c', 512, 84],
          ['L-104', 'HA-9004', 'PINIT-33109284', 'Biomechanical Sculptural Asset 3D', 'High-poly 3D mesh with procedural PBR textures. Biomechanic organic form for game engines & VFX.', '3d', '3d,blender,mesh,biomechanic', 89, 279, 1499, 3899, 1, 'live', 'Silver', 88, 12, '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f', 198, 29],
          ['L-105', 'HA-9005', 'PINIT-33109284', 'Synthwave Soundscapes Audio Suite', 'Lossless WAV stems for ambient electronic music soundtrack, AI-assisted rhythm generation with human analog synths.', 'audio', 'synthwave,music,audio,stems', 49, 149, 699, 1799, 1, 'live', 'Bronze', 55, 45, '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 167, 19]
        ];

        listings.forEach(item => {
          db.run(`
            INSERT INTO listings (listing_id, asset_id, pinit_id, title, description, vertical, tags, price_personal, price_commercial, price_exclusive, price_enterprise, ai_training_opt_out, status, badge_tier, human_percent, ai_percent, dna_hash, views, saves)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, item);
        });

        // Seed Sealed Sales Ledger
        const sales = [
          ['SEAL-880192', 'ORD-40192', 'L-101', 'HA-9001', 'PINIT-90481234', 'PX-772091', 'PINIT-BUYER-001', 'Aether Dynamics Corp', 'licensing@aether.com', 'Aether Dynamics', 'commercial', 249.00, 37.35, 211.65, '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', 'v2.1-provenance', 'sealed', '2026-08-01 14:30:00'],
          ['SEAL-880193', 'ORD-40193', 'L-103', 'HA-9003', 'PINIT-90481234', 'PX-772091', 'PINIT-BUYER-002', 'Veritas Media Group', 'content@veritas.org', 'Veritas Media', 'personal', 59.00, 8.85, 50.15, '0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c', 'v2.1-provenance', 'sealed', '2026-08-04 09:15:00']
        ];

        sales.forEach(sale => {
          db.run(`
            INSERT INTO orders_sealed (seal_id, order_id, listing_id, asset_id, seller_pinit_id, seller_exchange_id, buyer_pinit_id, buyer_name, buyer_email, buyer_org, license_tier, price_paid, platform_fee, creator_net, dna_hash_summary, license_terms_version, status, sealed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, sale);
        });

        // Seed Requirements
        const requirements = [
          ['REQ-301', 'Nexus Autonomous Systems', 'Nexus Auto', 'Looking for High-Resolution LiDAR Point Cloud Datasets for Autonomous Driving', 'Need verified real-world sensor point clouds for machine vision benchmarking. Human capture preferred.', 'concepts', 5000.00, '2026-08-20', 4, 'open'],
          ['REQ-302', 'Vanguard Film Studio', 'Vanguard Pictures', 'Cinematic 8K Atmospheric Desert Timelapse Stems', 'Looking for 8K RED or ARRI drone timelapses of desert dunes during blue hour and golden hour.', 'video', 3200.00, '2026-08-15', 7, 'open'],
          ['REQ-303', 'Apex Gaming Infrastructure', 'Apex Games', 'PBR Metallic Surface Texture Packs with Sensor DNA', 'Need 50+ seamless metallic PBR texture maps with verified studio camera sensor DNA.', '3d', 1800.00, '2026-08-25', 2, 'open']
        ];

        requirements.forEach(req => {
          db.run(`
            INSERT INTO requirements (req_id, buyer_name, buyer_org, title, description, vertical, budget, deadline, proposals_count, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, req);
        });

        // Seed Tracking Jobs
        db.run(`
          INSERT INTO tracking_jobs (job_id, seal_id, asset_id, seller_pinit_id, status, matches_found, last_checked)
          VALUES ('TRACK-501', 'SEAL-880192', 'HA-9001', 'PINIT-90481234', 'active_monitoring', 0, '2026-08-06 12:00:00')
        `);

        resolve();
      });
    });
  });
}

export default db;

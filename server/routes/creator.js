import express from 'express';
import db from '../database.js';

const router = express.Router();

// Creator Desk Consolidated Metrics
router.get('/desk', (req, res) => {
  const pinitId = req.query.pinit_id || 'PINIT-90481234';

  db.get("SELECT * FROM users WHERE pinit_id = ?", [pinitId], (err, userRow) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Auto-fallback user profile
    const user = userRow || {
      pinit_id: pinitId,
      exchange_id: 'PX-772091',
      name: 'Elena Rostova',
      email: 'elena.rostova@pinit.io',
      role: 'creator',
      kyc_status: 'verified',
      biometric_verified: 1,
      seller_plan: 'pro',
      bio: 'Verified Provenance Creator'
    };

    // Fetch Creator Listings
    db.all("SELECT * FROM listings WHERE pinit_id = ? ORDER BY created_at DESC", [pinitId], (err, listings) => {
      if (err) return res.status(500).json({ error: err.message });

      // Fetch Creator Sealed Sales
      db.all("SELECT * FROM orders_sealed WHERE seller_pinit_id = ? ORDER BY sealed_at DESC", [pinitId], (err, sales) => {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch Post-Sale Tracking Jobs
        db.all("SELECT * FROM tracking_jobs WHERE seller_pinit_id = ?", [pinitId], (err, trackingJobs) => {
          if (err) return res.status(500).json({ error: err.message });

          // Fetch Open Requirements
          db.all("SELECT * FROM requirements WHERE status = 'open' ORDER BY budget DESC", [], (err, requirements) => {
            if (err) return res.status(500).json({ error: err.message });

            // Calculate aggregate metrics
            const totalGrossRevenue = sales.reduce((acc, s) => acc + (s.price_paid || 0), 0);
            const totalNetRevenue = sales.reduce((acc, s) => acc + (s.creator_net || 0), 0);
            const totalViews = listings.reduce((acc, l) => acc + (l.views || 0), 0);
            const totalSaves = listings.reduce((acc, l) => acc + (l.saves || 0), 0);

            res.json({
              user: user,
              metrics: {
                total_gross_revenue: Math.round(totalGrossRevenue * 100) / 100,
                total_net_revenue: Math.round(totalNetRevenue * 100) / 100,
                total_views: totalViews,
                total_saves: totalSaves,
                active_listings_count: listings.filter(l => l.status === 'live').length,
                sealed_sales_count: sales.length,
                payout_pending: Math.round(totalNetRevenue * 100) / 100
              },
              listings: listings,
              sealed_sales: sales,
              tracking_jobs: trackingJobs,
              requirements: requirements
            });
          });
        });
      });
    });
  });
});

export default router;

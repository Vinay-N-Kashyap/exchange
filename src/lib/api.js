import { supabase } from './supabase';

const mockUser = {
  pinit_id: 'PINIT-90481234',
  exchange_id: 'PX-772091',
  name: 'Elena Rostova',
  email: 'elena.rostova@pinit.io',
  role: 'creator',
  kyc_status: 'verified',
  biometric_verified: 1,
  seller_plan: 'enterprise_pro'
};

const initialListings = [
  {
    listing_id: 'L-101',
    asset_id: 'HA-9001',
    pinit_id: 'PINIT-90481234',
    creator_name: 'Elena Rostova',
    creator_exchange_id: 'PX-772091',
    title: 'Cybernetic Neo-Tokyo Architecture',
    description: 'Hyper-detailed futuristic cityscape photographed under blue twilight.',
    vertical: 'images',
    tags: 'cyberpunk,architecture,tokyo',
    price_personal: 79,
    price_commercial: 249,
    price_exclusive: 1299,
    price_enterprise: 3499,
    badge_tier: 'Gold',
    human_percent: 95,
    ai_percent: 5,
    dna_hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    preview_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
  },
  {
    listing_id: 'L-102',
    asset_id: 'HA-9002',
    pinit_id: 'PINIT-90481234',
    creator_name: 'Elena Rostova',
    creator_exchange_id: 'PX-772091',
    title: 'Nordic Fjord Drone Survey 8K',
    description: 'Raw 8K RED aerial drone footage of Norwegian coastline.',
    vertical: 'video',
    tags: 'drone,fjord,nature,8k',
    price_personal: 129,
    price_commercial: 399,
    price_exclusive: 1899,
    price_enterprise: 4999,
    badge_tier: 'Gold',
    human_percent: 98,
    ai_percent: 2,
    dna_hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    preview_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    listing_id: 'L-103',
    asset_id: 'HA-9003',
    pinit_id: 'PINIT-33109284',
    creator_name: 'Marcus Vance',
    creator_exchange_id: 'PX-441802',
    title: 'Quantum Computing UI Component System',
    description: 'Figma & React component library for high-density fintech desktops.',
    vertical: 'ui_ux',
    tags: 'ui,ux,figma,react',
    price_personal: 59,
    price_commercial: 179,
    price_exclusive: 899,
    price_enterprise: 2499,
    badge_tier: 'Silver',
    human_percent: 75,
    ai_percent: 25,
    dna_hash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c',
    preview_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
  }
];

const initialHubAssets = [
  {
    asset_id: 'HA-9001',
    pinit_id: 'PINIT-90481234',
    title: 'Cybernetic Neo-Tokyo Architecture',
    file_type: 'image',
    vertical: 'images',
    preview_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    vault_encrypted: 1,
    dna_record_id: 'DNA-9001-GOLD',
    human_percent: 95,
    ai_percent: 5,
    badge_tier: 'Gold'
  },
  {
    asset_id: 'HA-9002',
    pinit_id: 'PINIT-90481234',
    title: 'Nordic Fjord Drone Survey 8K',
    file_type: 'video',
    vertical: 'video',
    preview_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    vault_encrypted: 1,
    dna_record_id: 'DNA-9002-GOLD',
    human_percent: 98,
    ai_percent: 2,
    badge_tier: 'Gold'
  },
  {
    asset_id: 'HA-9224',
    pinit_id: 'PINIT-90481234',
    title: 'Synthetic Cyberpunk Concept Art',
    file_type: 'image',
    vertical: 'concepts',
    preview_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    vault_encrypted: 1,
    dna_record_id: 'DNA-9224-BRONZE',
    human_percent: 10,
    ai_percent: 90,
    badge_tier: 'Bronze'
  }
];

// Helper to check if API response is JSON
async function tryFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return { ok: true, data: await res.json() };
    }
    if (!res.ok && contentType.includes('application/json')) {
      const errData = await res.json();
      return { ok: false, status: res.status, error: errData.error || errData.message };
    }
  } catch (err) {
    // Network / static deployment fallback
  }
  return null;
}

export async function fetchCurrentUser() {
  const result = await tryFetchJson('/api/auth/me');
  if (result && result.ok) return result.data;
  return mockUser;
}

export async function apiFetchListings(vertical = 'all', badge = 'all', search = '') {
  const result = await tryFetchJson(`/api/listings?vertical=${vertical}&badge=${badge}&search=${encodeURIComponent(search)}`);
  if (result && result.ok) return result.data;

  // Supabase fallback
  if (supabase) {
    try {
      const { data, error } = await supabase.from('content_items').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          listing_id: item.listing_id || item.id,
          asset_id: item.asset_id || 'HA-9001',
          pinit_id: 'PINIT-90481234',
          creator_name: 'Elena Rostova',
          creator_exchange_id: 'PX-772091',
          title: item.title,
          description: item.description || '',
          vertical: item.vertical || 'images',
          tags: item.tags || '',
          price_personal: item.price_personal || item.price || 49,
          price_commercial: item.price_commercial || 149,
          price_exclusive: item.price_exclusive || 899,
          price_enterprise: item.price_enterprise || 2499,
          badge_tier: item.badge_tier || 'Gold',
          human_percent: item.human_percent || 95,
          ai_percent: item.ai_percent || 5,
          dna_hash: item.dna_hash || '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
          preview_url: item.storage_url || item.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
        }));
      }
    } catch (e) {}
  }

  // Filter mock listings
  let filtered = [...initialListings];
  if (vertical !== 'all') filtered = filtered.filter(l => l.vertical === vertical);
  if (badge !== 'all') filtered = filtered.filter(l => l.badge_tier.toLowerCase() === badge.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tags.toLowerCase().includes(q));
  }
  return filtered;
}

export async function apiFetchListingDetail(listingId) {
  const result = await tryFetchJson(`/api/listings/${listingId}`);
  if (result && result.ok) return result.data;

  const listings = await apiFetchListings();
  return listings.find(l => l.listing_id === listingId || l.id === listingId) || initialListings[0];
}

export async function apiFetchHubAssets(pinitId = 'PINIT-90481234') {
  const result = await tryFetchJson(`/api/hub/assets?pinit_id=${pinitId}`);
  if (result && result.ok) return result.data;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('vault_registry').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          asset_id: item.asset_id || item.id,
          pinit_id: pinitId,
          title: item.file_name || item.title || 'Protected Vault Asset',
          file_type: item.file_type || 'image',
          vertical: 'images',
          preview_url: item.url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
          vault_encrypted: 1,
          dna_record_id: item.dna_signature || 'DNA-9001-GOLD',
          human_percent: item.human_percent || 95,
          ai_percent: item.ai_percent || 5,
          badge_tier: item.badge_tier || 'Gold'
        }));
      }
    } catch (e) {}
  }

  return initialHubAssets;
}

export async function apiProtectAsset(assetData) {
  const result = await tryFetchJson('/api/hub/protect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData)
  });
  if (result && result.ok) return result.data;

  const humanScore = Number(assetData.human_percent) || 90;
  const aiScore = Number(assetData.ai_percent) || (100 - humanScore);
  let badgeTier = humanScore >= 90 ? 'Gold' : humanScore >= 60 ? 'Silver' : 'Bronze';
  const assetId = 'HA-' + Math.floor(1000 + Math.random() * 9000);
  const dnaRecordId = 'DNA-' + Math.floor(1000 + Math.random() * 9000) + '-' + badgeTier.substring(0, 1);
  const preview = assetData.preview_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

  if (supabase) {
    try {
      await supabase.from('vault_registry').insert([{
        file_name: assetData.title,
        file_type: assetData.file_type || 'image',
        url: preview,
        hash: '0x' + Math.random().toString(16).substr(2, 32),
        asset_id: assetId,
        dna_signature: dnaRecordId,
        human_percent: humanScore,
        ai_percent: aiScore,
        badge_tier: badgeTier
      }]);
    } catch (e) {}
  }

  const newAsset = {
    asset_id: assetId,
    pinit_id: assetData.pinit_id || 'PINIT-90481234',
    title: assetData.title,
    file_type: assetData.file_type || 'image',
    vertical: assetData.vertical || 'images',
    preview_url: preview,
    vault_encrypted: 1,
    dna_record_id: dnaRecordId,
    human_percent: humanScore,
    ai_percent: aiScore,
    badge_tier: badgeTier
  };

  initialHubAssets.unshift(newAsset);
  return { message: "Asset protected in PinIT Hub Vault with DNA Record", asset: newAsset };
}

export async function apiPublishListing(listingData) {
  // Check mandatory AI Policy Guard (>80% AI block)
  const aiPercent = Number(listingData.ai_percent) || 0;
  if (aiPercent > 80) {
    throw new Error("This asset exceeds the 80% AI-content limit and cannot be listed on PinIT Exchange.");
  }

  const result = await tryFetchJson('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData)
  });
  if (result && result.ok) return result.data;

  if (result && !result.ok && result.error) {
    throw new Error(result.error);
  }

  const humanScore = Number(listingData.human_percent) || (100 - aiPercent);
  let badgeTier = humanScore >= 90 ? 'Gold' : humanScore >= 60 ? 'Silver' : 'Bronze';
  const listingId = 'L-' + Math.floor(100 + Math.random() * 900);
  const dnaHash = '0x' + Math.random().toString(16).substr(2, 32);
  const preview = listingData.preview_url || 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80';

  if (supabase) {
    try {
      await supabase.from('content_items').insert([{
        listing_id: listingId,
        asset_id: listingData.asset_id,
        title: listingData.title,
        description: listingData.description || '',
        vertical: listingData.vertical || 'images',
        tags: listingData.tags || '',
        price_personal: listingData.price_personal || 49,
        price_commercial: listingData.price_commercial || 149,
        price_exclusive: listingData.price_exclusive || 899,
        price_enterprise: listingData.price_enterprise || 2499,
        badge_tier: badgeTier,
        human_percent: humanScore,
        ai_percent: aiPercent,
        dna_hash: dnaHash,
        storage_url: preview,
        url: preview
      }]);
    } catch (e) {}
  }

  const newListing = {
    listing_id: listingId,
    asset_id: listingData.asset_id,
    pinit_id: listingData.pinit_id || 'PINIT-90481234',
    creator_name: 'Elena Rostova',
    creator_exchange_id: 'PX-772091',
    title: listingData.title,
    description: listingData.description || '',
    vertical: listingData.vertical || 'images',
    tags: listingData.tags || '',
    price_personal: listingData.price_personal || 49,
    price_commercial: listingData.price_commercial || 149,
    price_exclusive: listingData.price_exclusive || 899,
    price_enterprise: listingData.price_enterprise || 2499,
    badge_tier: badgeTier,
    human_percent: humanScore,
    ai_percent: aiPercent,
    dna_hash: dnaHash,
    preview_url: preview
  };

  initialListings.unshift(newListing);
  return { message: "Listing published to PinIT Exchange", listing: newListing };
}

export async function apiCheckout(orderData) {
  const result = await tryFetchJson('/api/orders/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (result && result.ok) return result.data;

  const sealId = 'SEAL-' + Math.floor(100000 + Math.random() * 900000);
  const pricePaid = Number(orderData.price_paid) || 149;
  const platformFee = Number((pricePaid * 0.15).toFixed(2));
  const creatorNet = Number((pricePaid * 0.85).toFixed(2));

  if (supabase) {
    try {
      await supabase.from('purchased_licenses').insert([{
        seal_id: sealId,
        order_id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        license_type: orderData.license_tier || 'commercial',
        price: pricePaid,
        platform_fee: platformFee,
        creator_net: creatorNet,
        buyer_name: orderData.buyer_name || 'Enterprise Buyer',
        buyer_email: orderData.buyer_email || 'buyer@enterprise.com',
        status: 'sealed'
      }]);
    } catch (e) {}
  }

  return {
    message: "Transaction sealed in immutable provenance ledger",
    seal: {
      seal_id: sealId,
      order_id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      price_paid: pricePaid,
      platform_fee: platformFee,
      creator_net: creatorNet,
      license_tier: orderData.license_tier || 'commercial',
      buyer_name: orderData.buyer_name || 'Enterprise Buyer',
      buyer_email: orderData.buyer_email || 'buyer@enterprise.com'
    }
  };
}

export async function apiFetchRequirements() {
  const result = await tryFetchJson('/api/requirements');
  if (result && result.ok) return result.data;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('requirements').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {}
  }

  return [
    {
      req_id: 'REQ-8810',
      buyer_name: 'Vanguard Studios',
      buyer_org: 'Vanguard Media Group',
      title: '8K Architectural Drone Scans of Tokyo Towers',
      description: 'Require verified non-AI camera raw footage of Shibuya and Shinjuku skyscrapers.',
      vertical: 'video',
      budget: 4500,
      deadline: '2026-08-30',
      proposals_count: 7,
      status: 'open'
    },
    {
      req_id: 'REQ-8812',
      buyer_name: 'Nexus UI Labs',
      buyer_org: 'Nexus Fintech Corp',
      title: 'High-Density Fintech Component Library (Figma)',
      description: 'Looking for verified Gold-badge UI design systems for quantum trading dashboards.',
      vertical: 'ui_ux',
      budget: 3200,
      deadline: '2026-09-15',
      proposals_count: 4,
      status: 'open'
    }
  ];
}

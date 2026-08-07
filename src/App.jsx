import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import ListFromHubModal from './components/ListFromHubModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';

import HomePage from './pages/HomePage.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Collections from './pages/Collections.jsx';
import RequirementsExchange from './pages/RequirementsExchange.jsx';
import CreatorPassports from './pages/CreatorPassports.jsx';
import EnterpriseLicensing from './pages/EnterpriseLicensing.jsx';
import TrustCenter from './pages/TrustCenter.jsx';
import KnowledgeGuide from './pages/KnowledgeGuide.jsx';
import MyLicenses from './pages/MyLicenses.jsx';
import CreatorDesk from './pages/CreatorDesk.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import HubSim from './pages/HubSim.jsx';

import { fetchCurrentUser as apiFetchCurrentUser } from './lib/api.js';

export default function App() {
  const [activeApp, setActiveApp] = useState('exchange'); // 'exchange' | 'hub'
  const [activePage, setActivePage] = useState('marketplace'); // 'home' | 'marketplace' | 'listing_detail' | 'collections' | 'requirements' | 'passports' | 'enterprise' | 'trust' | 'knowledge' | 'my_licenses' | 'creator_desk' | 'settings'
  
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [checkoutListing, setCheckoutListing] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await apiFetchCurrentUser();
      setUser(data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const handleSelectListing = (id) => {
    setSelectedListingId(id);
    setActivePage('listing_detail');
  };

  const handleOpenCheckout = (listing) => {
    setCheckoutListing(listing);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Navbar with Working App Switcher and All Nav Modules */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
        onOpenListFromHub={() => setIsListModalOpen(true)}
        user={user}
      />

      {/* Main Content View Switcher */}
      <main style={{ flex: 1 }}>
        {activeApp === 'hub' ? (
          <HubSim 
            user={user} 
            onOpenListFromHub={() => setIsListModalOpen(true)}
            onSwitchToExchange={() => setActiveApp('exchange')}
          />
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage 
                onNavigate={setActivePage} 
                onOpenListFromHub={() => setIsListModalOpen(true)} 
              />
            )}

            {activePage === 'marketplace' && (
              <Marketplace 
                onSelectListing={handleSelectListing} 
                onOpenListFromHub={() => setIsListModalOpen(true)} 
              />
            )}

            {activePage === 'listing_detail' && (
              <ListingDetail 
                listingId={selectedListingId} 
                onBack={() => setActivePage('marketplace')}
                onOpenCheckout={handleOpenCheckout}
              />
            )}

            {activePage === 'collections' && (
              <Collections 
                onSelectListing={handleSelectListing}
              />
            )}

            {activePage === 'requirements' && (
              <RequirementsExchange 
                user={user}
              />
            )}

            {activePage === 'passports' && (
              <CreatorPassports />
            )}

            {activePage === 'enterprise' && (
              <EnterpriseLicensing />
            )}

            {activePage === 'trust' && (
              <TrustCenter 
                onOpenListFromHub={() => setIsListModalOpen(true)} 
              />
            )}

            {activePage === 'knowledge' && (
              <KnowledgeGuide />
            )}

            {activePage === 'my_licenses' && (
              <MyLicenses 
                user={user}
                onNavigateToMarketplace={() => setActivePage('marketplace')}
              />
            )}

            {activePage === 'creator_desk' && (
              <CreatorDesk 
                user={user}
                onOpenListFromHub={() => setIsListModalOpen(true)}
                onSelectListing={handleSelectListing}
              />
            )}

            {activePage === 'settings' && (
              <SettingsPage 
                user={user}
                setUser={setUser}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <ListFromHubModal 
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onListingCreated={() => {
          setActivePage('marketplace');
        }}
        user={user}
      />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        listing={checkoutListing}
        user={user}
        onOrderComplete={(sealedOrder) => {
          setActivePage('my_licenses');
        }}
      />

      {/* Footer */}
      <footer style={{
        background: 'rgba(7, 10, 17, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            PinIT Exchange &copy; {new Date().getFullYear()} — Powered by PinIT Hub Vault &amp; Sensor DNA Engine.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('trust'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Trust Center</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('knowledge'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>License Terms</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('enterprise'); }} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Enterprise SLA</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

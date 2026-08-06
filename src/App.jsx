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

export default function App() {
  const [activeApp, setActiveApp] = useState('exchange'); // 'exchange' | 'hub'
  const [activePage, setActivePage] = useState('marketplace'); // 'home' | 'marketplace' | 'listing_detail' | 'collections' | 'requirements' | 'passports' | 'enterprise' | 'trust' | 'knowledge' | 'my_licenses' | 'creator_desk' | 'settings'
  
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [checkoutListing, setCheckoutListing] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me?pinit_id=PINIT-90481234');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
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

      {/* Main Content View */}
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
                onNavigate={(page) => setActivePage(page)}
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
                onBack={() => setActivePage('marketplace')}
              />
            )}

            {activePage === 'passports' && (
              <CreatorPassports 
                user={user}
              />
            )}

            {activePage === 'enterprise' && (
              <EnterpriseLicensing />
            )}

            {activePage === 'trust' && (
              <TrustCenter />
            )}

            {activePage === 'knowledge' && (
              <KnowledgeGuide />
            )}

            {activePage === 'my_licenses' && (
              <MyLicenses 
                user={user}
                onViewCertificate={(sealId) => alert(`Certificate ${sealId} verified tamper-proof.`)}
              />
            )}

            {activePage === 'creator_desk' && (
              <CreatorDesk 
                user={user}
                onOpenListFromHub={() => setIsListModalOpen(true)}
              />
            )}

            {activePage === 'settings' && (
              <SettingsPage 
                user={user}
                onUserUpdated={(updated) => setUser(updated)}
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
          setIsListModalOpen(false);
          setActivePage('marketplace');
        }}
        user={user}
      />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        listing={checkoutListing}
        onOrderCompleted={(order) => {
          console.log("Order sealed:", order);
        }}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px',
        marginTop: '60px',
        background: '#04060b',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong style={{ color: '#fff' }}>PinIT Exchange</strong> — Powered by PinIT Hub Vault &amp; Provenance Engine.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('trust')}>Trust Center</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('knowledge')}>Help &amp; Guide</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActivePage('enterprise')}>Enterprise SLA</span>
            <span style={{ color: 'var(--emerald)' }}>● Provenance Ledger Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

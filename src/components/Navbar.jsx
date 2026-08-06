import React, { useState } from 'react';
import { ShieldCheck, Store, Lock, Layers, User, PlusCircle, Briefcase, Award, BookOpen, Building2, ShoppingBag, Settings, Grid, ArrowLeft } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeApp, setActiveApp, onOpenListFromHub, user }) {
  // Helper to switch to Exchange and navigate to specific page
  const handleNavClick = (page) => {
    if (activeApp !== 'exchange') {
      setActiveApp('exchange');
    }
    setActivePage(page);
  };

  return (
    <>
      {/* 4.1 Platform Link Model App Switcher Banner */}
      <div className="app-switcher-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <span>PinIT Platform Link: <strong style={{ color: '#fff' }}>{activeApp === 'hub' ? 'PinIT Hub (Private Vault Mode)' : 'PinIT Exchange (Public Marketplace Mode)'}</strong></span>
        </div>
        <div className="app-switcher-toggle">
          <button 
            className={`switcher-btn ${activeApp === 'hub' ? 'active' : ''}`}
            onClick={() => setActiveApp('hub')}
          >
            <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            PinIT Hub (Private Vault)
          </button>
          <button 
            className={`switcher-btn ${activeApp === 'exchange' ? 'active' : ''}`}
            onClick={() => setActiveApp('exchange')}
          >
            <Store size={12} style={{ display: 'inline', marginRight: '4px' }} />
            PinIT Exchange (Public Exchange)
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="header-nav">
        <div className="nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: 0 }}>
            <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              <div style={{
                background: activeApp === 'hub' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
                flexShrink: 0
              }}>
                {activeApp === 'hub' ? <Lock size={18} color="#fff" /> : <ShieldCheck size={20} color="#fff" />}
              </div>
              <span style={{ whiteSpace: 'nowrap' }}>
                PinIT <span style={{ color: activeApp === 'hub' ? 'var(--indigo)' : 'var(--primary)', fontWeight: 400 }}>{activeApp === 'hub' ? 'Hub' : 'Exchange'}</span>
              </span>
              <span className="brand-badge" style={{ flexShrink: 0, background: activeApp === 'hub' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: activeApp === 'hub' ? 'var(--indigo)' : 'var(--primary)' }}>
                {activeApp === 'hub' ? 'Private Vault' : 'Provenance'}
              </span>
            </a>

            {/* Render Nav Links ONLY when activeApp === 'exchange' */}
            {activeApp === 'exchange' && (
              <nav className="nav-links">
                <button 
                  className={`nav-link ${activePage === 'marketplace' ? 'active' : ''}`}
                  onClick={() => handleNavClick('marketplace')}
                >
                  Exchange
                </button>
                <button 
                  className={`nav-link ${activePage === 'collections' ? 'active' : ''}`}
                  onClick={() => handleNavClick('collections')}
                >
                  Collections
                </button>
                <button 
                  className={`nav-link ${activePage === 'requirements' ? 'active' : ''}`}
                  onClick={() => handleNavClick('requirements')}
                >
                  Requirements
                </button>
                <button 
                  className={`nav-link ${activePage === 'passports' ? 'active' : ''}`}
                  onClick={() => handleNavClick('passports')}
                >
                  Creator Passports
                </button>
                <button 
                  className={`nav-link ${activePage === 'enterprise' ? 'active' : ''}`}
                  onClick={() => handleNavClick('enterprise')}
                >
                  Enterprise
                </button>
                <button 
                  className={`nav-link ${activePage === 'trust' ? 'active' : ''}`}
                  onClick={() => handleNavClick('trust')}
                >
                  Trust Center
                </button>
                <button 
                  className={`nav-link ${activePage === 'knowledge' ? 'active' : ''}`}
                  onClick={() => handleNavClick('knowledge')}
                >
                  Help &amp; Guide
                </button>
              </nav>
            )}

            {/* In Hub Mode, show indicator */}
            {activeApp === 'hub' && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <Lock size={14} color="var(--indigo)" />
                <span>Private Owner Workspace (Hub Vault Mode)</span>
              </div>
            )}
          </div>

          {/* Right Action Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {activeApp === 'hub' ? (
              <button className="btn-secondary" onClick={() => setActiveApp('exchange')}>
                <Store size={16} /> Open PinIT Exchange
              </button>
            ) : (
              <button className="btn-primary" onClick={onOpenListFromHub} style={{ padding: '8px 16px' }}>
                <PlusCircle size={16} /> List from Hub
              </button>
            )}

            {activeApp === 'exchange' && (
              <>
                <button 
                  className={`btn-secondary ${activePage === 'my_licenses' ? 'active' : ''}`}
                  onClick={() => handleNavClick('my_licenses')}
                  title="My Licenses & Purchases"
                  style={{ padding: '8px 12px', height: '36px' }}
                >
                  <ShoppingBag size={16} />
                </button>

                <button 
                  className={`btn-secondary ${activePage === 'settings' ? 'active' : ''}`}
                  onClick={() => handleNavClick('settings')}
                  title="Settings"
                  style={{ padding: '8px 12px', height: '36px' }}
                >
                  <Settings size={16} />
                </button>

                {/* Desk User Pill with Fixed Line Height & Padding */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: (activeApp === 'exchange' && activePage === 'creator_desk') ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    padding: '4px 12px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onClick={() => handleNavClick('creator_desk')}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--indigo)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {user?.name ? user.name[0] : 'E'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: '1.25' }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.8rem' }}>Desk</div>
                    <div style={{ color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 600 }}>{user?.pinit_id || 'PINIT-90481234'}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

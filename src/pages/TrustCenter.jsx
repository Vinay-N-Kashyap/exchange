import React from 'react';
import { ShieldCheck, Award, Lock, Sparkles, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function TrustCenter() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(59, 130, 246, 0.15)',
          padding: '6px 16px',
          borderRadius: '99px',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <ShieldCheck size={16} /> PinIT Provenance Architecture
        </div>

        <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>
          PinIT Exchange Trust & Provenance Center
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          Learn how PinIT Hub and PinIT Exchange enforce camera sensor DNA verification, strict AI publishing thresholds, and immutable sale seals.
        </p>
      </div>

      {/* Core Rule Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '12px' }}>The One-Line Platform Rule</h3>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
          <strong>Exchange is only for buying and selling.</strong> All deep protection work (camera sensor DNA, vault encryption, monitoring, investigation, leak tracking) happens behind Exchange, powered by <strong>PinIT Hub</strong>. Exchange shows trust signals and sale results; Hub does the heavy forensic/ops work.
        </p>
      </div>

      {/* Section 9: AI Content Policy Grid */}
      <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '20px' }}>AI Content Policy & Authenticity Badges</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        {/* Policy Rule */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '12px' }}>
            <AlertTriangle size={22} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>The 80% AI Cutoff Rule</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Any digital asset containing <strong>more than 80% AI-generated content</strong> is strictly blocked from publishing on PinIT Exchange.
          </p>
          <div style={{
            marginTop: '16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#fca5a5',
            fontFamily: 'monospace'
          }}>
            &gt; "This asset exceeds the 80% AI-content limit and cannot be listed on PinIT Exchange."
          </div>
        </div>

        {/* Authenticity Badges */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--badge-gold)', marginBottom: '12px' }}>
            <Award size={22} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Human Authenticity Badges</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge-gold"><Award size={12} /> Gold Badge</span>
              <span style={{ color: 'var(--text-muted)' }}>90–100% Manual / Human-made (Highest trust)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge-silver"><Award size={12} /> Silver Badge</span>
              <span style={{ color: 'var(--text-muted)' }}>60–80% Manual / Human-made (Mixed / assisted)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge-bronze"><Award size={12} /> Bronze Badge</span>
              <span style={{ color: 'var(--text-muted)' }}>&lt;60% Human (Entry acceptable band)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Sale Ledger Explanation */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FileCheck size={26} color="var(--emerald)" />
          <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>Immutable Sealed Sales Ledger</h3>
        </div>

        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '16px' }}>
          Every completed purchase on PinIT Exchange mints a permanent, append-only sale seal record (e.g. <code>SEAL-880192</code>). This record binds the seller's verified Exchange ID, buyer identity snapshot, SHA-256 DNA hash, and license terms version into a verifiable digital License Certificate.
        </p>
      </div>
    </div>
  );
}

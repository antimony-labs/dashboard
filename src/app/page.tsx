import ApiStatus from '@/components/ApiStatus';
import FleetStatus from '@/components/FleetStatus';

export default function Home() {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <h2 className="title">System Overview</h2>
          <p className="subtitle" style={{ marginTop: '0.25rem' }}>Real-time telemetry and ecosystem state.</p>
        </div>
        <ApiStatus />
      </header>

      {/* Metric Cards Grid */}
      <div className="metric-cards">
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>History Window</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>24h</span>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 500 }}>chronological telemetry</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Storage Layer</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>SQLite</span>
            <span className="text-small">time-series persistence</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ingress Security</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>JWT</span>
            <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Ed25519 signed agent posts</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="overview-grid">
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>Live Fleet Telemetry</h3>
          <FleetStatus />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>Operational Notes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div><span style={{ color: 'var(--accent-base)' }}>[phase-5]</span> Telemetry endpoint now targets grouped historical series for graph rendering.</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[sqlite]</span> Data retention job prunes stale telemetry records on a fixed interval.</div>
            <div><span style={{ color: 'var(--warning)' }}>[ops]</span> `sbl4` rollout still depends on restored SSH reachability from this workstation.</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[ui]</span> Charts use monotone splines, gradient strokes, and dark glass tooltips.</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[edge]</span> Cloudflare Pages deploys after the dashboard repo receives a push.</div>
            <div style={{ marginTop: '1rem', opacity: 0.5 }}>... live metrics continue streaming in the main panel ...</div>
          </div>
        </div>
      </div>
    </>
  );
}

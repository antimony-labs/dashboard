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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Projects</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>03</span>
            <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 500 }}>+1 this week</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fleet Nodes Online</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>04</span>
            <span className="text-small">/ 07 total</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="text-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tailscale Tunnel</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: 1 }}>OK</span>
            <span className="text-small" style={{ color: 'var(--text-secondary)' }}>Secured</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', flex: 1 }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>Live Fleet Telemetry</h3>
          <FleetStatus />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>System Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div><span style={{ color: 'var(--accent-base)' }}>[19:22:01]</span> INIT_TUNNEL: api.too.foo OK</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[19:21:45]</span> HEARTBEAT: sbl3 RECEIVED</div>
            <div><span style={{ color: 'var(--warning)' }}>[19:20:12]</span> WARN: sbl0 CPU thermal state high</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[19:15:00]</span> SYNC: GitHub tokens refreshed</div>
            <div><span style={{ color: 'var(--accent-base)' }}>[19:10:22]</span> DEPLOY: dashboard initial edge push</div>
            <div style={{ marginTop: '1rem', opacity: 0.5 }}>... waiting for new events ...</div>
          </div>
        </div>
      </div>
    </>
  );
}

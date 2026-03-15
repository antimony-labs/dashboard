import ApiStatus from '@/components/ApiStatus';

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
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>Active Deployments</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Mock Item 1 */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>e51.org</div>
                  <div className="text-small">Production | Cloudflare Pages</div>
                </div>
              </div>
              <span className="status-dot online"></span>
            </div>

            {/* Mock Item 2 */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '1.05rem' }}>fleet-core</div>
                  <div className="text-small">API | sbl4 (Rust Axum)</div>
                </div>
              </div>
              <span className="status-dot online"></span>
            </div>
            
            <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>+ Deploy New Project</a>
            </div>
          </div>
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

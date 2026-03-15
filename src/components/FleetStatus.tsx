"use client";
import { useEffect, useState } from 'react';

export interface NodeTelemetry {
  hostname: String;
  cpu_usage: number;
  ram_used_mb: number;
  ram_total_mb: number;
  tailscale_ip: String;
  timestamp_sec: number;
}

export default function FleetStatus() {
  const [telemetry, setTelemetry] = useState<Record<string, NodeTelemetry>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTelemetry = async () => {
      try {
        const res = await fetch('https://api.antimony-labs.com/telemetry');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) {
            setTelemetry(data);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Failed to fetch telemetry", err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-secondary)', padding: '1rem' }}>Loading fleet telemetry data...</div>;
  }

  const nodes = Object.values(telemetry).sort((a, b) => (a.hostname > b.hostname ? 1 : -1));

  if (nodes.length === 0) {
    return <div style={{ color: 'var(--warning)', padding: '1rem' }}>No active telemetry signals received yet.</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {nodes.map(node => {
        const isStale = (Date.now() / 1000) - node.timestamp_sec > 15;
        const memoryPercent = (node.ram_used_mb / node.ram_total_mb) * 100;
        
        return (
          <div key={`${node.hostname}`} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '1.05rem', color: isStale ? 'var(--text-secondary)' : '#fff' }}>{node.hostname}</div>
                  <div className="text-small" style={{ fontFamily: 'monospace' }}>{node.tailscale_ip}</div>
                </div>
              </div>
              <span className={`status-dot ${isStale ? '' : 'online'}`} style={isStale ? { backgroundColor: 'var(--warning)', boxShadow: 'none' } : {}}></span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="text-small">CPU Usage</span>
                  <span className="text-small" style={{ fontWeight: 500 }}>{node.cpu_usage.toFixed(1)}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(node.cpu_usage, 100)}%`, background: node.cpu_usage > 90 ? 'var(--error, #ff4c4c)' : node.cpu_usage > 70 ? 'var(--warning, #f5a623)' : 'var(--success)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="text-small">Memory</span>
                  <span className="text-small" style={{ fontWeight: 500 }}>{(node.ram_used_mb / 1024).toFixed(1)}GB / {(node.ram_total_mb / 1024).toFixed(1)}GB</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(memoryPercent, 100)}%`, background: memoryPercent > 90 ? 'var(--error, #ff4c4c)' : memoryPercent > 70 ? 'var(--warning, #f5a623)' : 'var(--success)' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

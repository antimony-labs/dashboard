"use client";
import { useEffect, useState } from 'react';

export default function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    let isSubscribed = true;

    const checkHealth = async () => {
      try {
        const res = await fetch('https://api.antimony-labs.com/health');
        if (res.ok) {
          const data = await res.json();
          if (isSubscribed) {
            setStatus('online');
            setVersion(data.version || '');
          }
        } else {
          if (isSubscribed) setStatus('offline');
        }
      } catch (err) {
        if (isSubscribed) setStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-xl)', gap: '0.75rem', transition: 'all 0.3s ease' }}>
      <span 
        className={status === 'online' ? 'status-dot online' : 'status-dot'} 
        style={{ 
          backgroundColor: status === 'checking' ? 'var(--text-secondary)' : status === 'offline' ? 'var(--error, #ff4c4c)' : undefined,
          boxShadow: status === 'online' ? '0 0 10px var(--success)' : status === 'offline' ? '0 0 10px var(--error, #ff4c4c)' : 'none'
        }}
      ></span>
      <span className="text-small" style={{ fontWeight: 500, color: '#fff' }}>
        core-api : {status === 'checking' ? 'Checking...' : status === 'online' ? `v${version}` : 'Offline'}
      </span>
    </div>
  );
}

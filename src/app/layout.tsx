import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "antimony-labs // Dashboard",
  description: "Ecosystem Management and Telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div style={{ marginBottom: '3rem' }}>
              <h1 className="title" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>antimony-labs</h1>
              <span className="text-small" style={{ opacity: 0.6 }}>SYSTEM.DASHBOARD V1.0</span>
            </div>
            
            <nav style={{ flex: 1 }}>
              <div style={{ marginBottom: '2rem' }}>
                <span className="text-small" style={{ display: 'block', marginBottom: '1rem', paddingLeft: '1rem', letterSpacing: '0.1em' }}>ECOSYSTEM</span>
                <Link href="/" className="nav-item active">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Overview
                </Link>
                <a href="#" className="nav-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Projects
                </a>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <span className="text-small" style={{ display: 'block', marginBottom: '1rem', paddingLeft: '1rem', letterSpacing: '0.1em' }}>INFRASTRUCTURE</span>
                <a href="#" className="nav-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                  Fleet (sbl0-sbl10)
                </a>
                <a href="#" className="nav-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Vaults
                </a>
                <a href="#" className="nav-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Firewall
                </a>
              </div>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #5a8bb0, #2c4a63)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Sb</div>
                 <div>
                   <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Shivam Bhardwaj</div>
                   <div className="text-small">Administrator</div>
                 </div>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

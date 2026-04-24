import type { Metadata, Viewport } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antimony Labs Dashboard",
  description: "Local operator cockpit for the Antimony Labs ecosystem.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="dashboard-layout">
          <aside className="sidebar">
            <div className="brand-block">
              <div className="brand-row">
                <h1 className="title brand-title">antimony-labs</h1>
                <ThemeToggle />
              </div>
              <span className="text-small eyebrow">LOCAL COMMAND SURFACE</span>
            </div>

            <div className="operator-card">
              <div className="operator-row">
                 <div className="operator-mark">Sb</div>
                 <div>
                   <div className="operator-name">Shivam Bhardwaj</div>
                   <div className="text-small">Administrator</div>
                 </div>
              </div>
            </div>
          </aside>

          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

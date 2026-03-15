"use client";

import { useEffect, useState } from "react";

type ApiState = "checking" | "online" | "offline";

interface HealthResponse {
  repository: string;
  status: string;
  version: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FLEET_API_BASE_URL ?? "https://api.antimony-labs.com";
const API_HEALTH_URL = `${API_BASE_URL}/health`;
const HEALTH_REFRESH_INTERVAL_MS = 20_000;

function formatCheckTime(timestamp: number | null) {
  if (!timestamp) {
    return "Awaiting first response";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
}

export default function ApiStatus() {
  const [status, setStatus] = useState<ApiState>("checking");
  const [version, setVersion] = useState("");
  const [repository, setRepository] = useState("antimony-labs/core");
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const checkHealth = async () => {
      try {
        const res = await fetch(API_HEALTH_URL, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: HealthResponse = await res.json();
        if (isSubscribed) {
          setStatus(data.status === "online" ? "online" : "offline");
          setRepository(data.repository || "antimony-labs/core");
          setVersion(data.version || "");
          setLastCheckedAt(Date.now());
        }
      } catch {
        if (isSubscribed) {
          setStatus("offline");
          setLastCheckedAt(Date.now());
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, HEALTH_REFRESH_INTERVAL_MS);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="glass-panel api-status-shell">
      <div className="api-status-main">
        <span
          className={`status-dot ${status === "online" ? "online" : ""}`}
          style={{
            backgroundColor:
              status === "checking"
                ? "rgba(255,255,255,0.45)"
                : status === "offline"
                  ? "var(--danger)"
                  : undefined,
            boxShadow:
              status === "online"
                ? "0 0 14px rgba(52, 211, 153, 0.6)"
                : status === "offline"
                  ? "0 0 14px rgba(239, 68, 68, 0.55)"
                  : "none",
          }}
        />
        <div>
          <div className="api-status-title">
            <strong>{repository}</strong>
            <span className={`api-status-badge ${status}`}>{status}</span>
          </div>
          <div className="api-status-meta">
            <span>{version ? `v${version}` : "version pending"}</span>
            <span>{formatCheckTime(lastCheckedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

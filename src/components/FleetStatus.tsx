"use client";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_FLEET_API_BASE_URL ?? "https://api.antimony-labs.com";
const API_URL = `${API_BASE_URL}/telemetry?hours=24`;
const REFRESH_INTERVAL_MS = 30_000;
const STALE_AFTER_SECS = 45;

type TooltipValue = number | string | Array<number | string> | undefined;

export interface NodeTelemetry {
  hostname: string;
  cpu_usage: number;
  ram_used_mb: number;
  ram_total_mb: number;
  load_avg_1m: number;
  load_avg_5m: number;
  load_avg_15m: number;
  uptime_secs: number;
  disk_used_gb: number;
  disk_total_gb: number;
  tailscale_ip: string;
  timestamp_sec: number;
}

interface TelemetrySampleWire {
  hostname?: string;
  cpu_usage?: number;
  ram_used_mb?: number;
  ram_total_mb?: number;
  load_avg_1m?: number;
  load_avg_5m?: number;
  load_avg_15m?: number;
  uptime_secs?: number;
  disk_used_gb?: number;
  disk_total_gb?: number;
  tailscale_ip?: string;
  timestamp_sec?: number;
}

interface FleetTelemetryResponse {
  window_hours: number;
  generated_at_sec: number;
  nodes: Record<string, NodeTelemetry[]>;
}

interface FleetTelemetryWireResponse {
  window_hours?: number;
  generated_at_sec?: number;
  nodes?: Record<string, TelemetrySampleWire[]>;
}

interface HistoryTooltipPayload {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: TooltipValue;
}

interface HistoryTooltipProps {
  active?: boolean;
  label?: number | string;
  payload?: HistoryTooltipPayload[];
  formatValue?: (value: TooltipValue, name: string) => string;
}

const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

function formatClock(timestampSec: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(timestampSec * 1000);
}

function formatTooltipDate(label?: number | string) {
  if (typeof label !== "number") {
    return "Unknown sample";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(label * 1000);
}

function formatUptime(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatTooltipMetric(value: TooltipValue, unit = "") {
  if (Array.isArray(value)) {
    return value.join(" / ");
  }

  if (typeof value === "number") {
    return `${decimalFormatter.format(value)}${unit}`;
  }

  if (typeof value === "string") {
    return value;
  }

  return "n/a";
}

function normalizeSample(sample: TelemetrySampleWire): NodeTelemetry {
  return {
    hostname: sample.hostname ?? "unknown-node",
    cpu_usage: sample.cpu_usage ?? 0,
    ram_used_mb: sample.ram_used_mb ?? 0,
    ram_total_mb: sample.ram_total_mb ?? 0,
    load_avg_1m: sample.load_avg_1m ?? 0,
    load_avg_5m: sample.load_avg_5m ?? 0,
    load_avg_15m: sample.load_avg_15m ?? 0,
    uptime_secs: sample.uptime_secs ?? 0,
    disk_used_gb: sample.disk_used_gb ?? 0,
    disk_total_gb: sample.disk_total_gb ?? 0,
    tailscale_ip: sample.tailscale_ip ?? "unavailable",
    timestamp_sec: sample.timestamp_sec ?? Math.floor(Date.now() / 1000),
  };
}

function normalizeTelemetryResponse(
  payload: FleetTelemetryWireResponse | TelemetrySampleWire[],
): FleetTelemetryResponse {
  const generatedAtSec = Math.floor(Date.now() / 1000);

  if (Array.isArray(payload)) {
    const nodes: Record<string, NodeTelemetry[]> = {};

    for (const rawSample of payload) {
      const sample = normalizeSample(rawSample);
      const bucket = nodes[sample.hostname] ?? [];
      bucket.push(sample);
      bucket.sort((left, right) => left.timestamp_sec - right.timestamp_sec);
      nodes[sample.hostname] = bucket;
    }

    return {
      window_hours: 24,
      generated_at_sec: generatedAtSec,
      nodes,
    };
  }

  const nodes: Record<string, NodeTelemetry[]> = {};

  for (const [hostname, history] of Object.entries(payload.nodes ?? {})) {
    nodes[hostname] = history
      .map((sample) => normalizeSample({ ...sample, hostname: sample.hostname ?? hostname }))
      .sort((left, right) => left.timestamp_sec - right.timestamp_sec);
  }

  return {
    window_hours: payload.window_hours ?? 24,
    generated_at_sec: payload.generated_at_sec ?? generatedAtSec,
    nodes,
  };
}

function HistoryTooltip({
  active,
  label,
  payload,
  formatValue,
}: HistoryTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{formatTooltipDate(label)}</div>
      {payload.map((entry) => {
        const name = entry.name ?? String(entry.dataKey ?? "metric");
        return (
          <div key={name} className="chart-tooltip-row">
            <span className="chart-tooltip-key">
              <span className="chart-tooltip-swatch" />
              {name}
            </span>
            <strong>
              {formatValue ? formatValue(entry.value, name) : formatTooltipMetric(entry.value)}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function MetricTile({
  label,
  value,
  detail,
  progress,
  variant,
}: {
  label: string;
  value: string;
  detail: string;
  progress: number;
  variant: "cpu" | "memory" | "disk";
}) {
  return (
    <div className="metric-tile">
      <div className="metric-label-row">
        <span className="text-small">{label}</span>
        <span className="metric-value">{value}</span>
      </div>
      <div className="metric-detail">{detail}</div>
      <progress className={`metric-progress ${variant}`} value={Math.min(Math.max(progress, 0), 100)} max={100} />
    </div>
  );
}

function ChartShell({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="chart-shell">
      <div className="chart-shell-header">
        <div>
          <h4>{title}</h4>
          <p>{caption}</p>
        </div>
      </div>
      <div className="chart-shell-canvas">{children}</div>
    </div>
  );
}

export default function FleetStatus() {
  const [telemetry, setTelemetry] = useState<FleetTelemetryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchTelemetry = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = normalizeTelemetryResponse(
          (await res.json()) as FleetTelemetryWireResponse | TelemetrySampleWire[],
        );
        if (isSubscribed) {
          setTelemetry(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch telemetry", err);
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, REFRESH_INTERVAL_MS);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="fleet-empty-state">Loading 24-hour telemetry history...</div>;
  }

  const nodeEntries = Object.entries(telemetry?.nodes ?? {})
    .filter(([, history]) => history.length > 0)
    .sort(([left], [right]) => left.localeCompare(right));

  if (nodeEntries.length === 0) {
    return <div className="fleet-empty-state">No active telemetry signals received yet.</div>;
  }

  return (
    <div className="fleet-stack">
      <div className="fleet-summary-bar">
        <div>
          <span className="fleet-summary-value">{nodeEntries.length}</span>
          <span className="fleet-summary-label">nodes streaming</span>
        </div>
        <div>
          <span className="fleet-summary-value">{telemetry?.window_hours ?? 24}h</span>
          <span className="fleet-summary-label">history window</span>
        </div>
        <div>
          <span className="fleet-summary-value">
            {formatClock(telemetry?.generated_at_sec ?? Math.floor(Date.now() / 1000))}
          </span>
          <span className="fleet-summary-label">last API refresh</span>
        </div>
      </div>

      {nodeEntries.map(([hostname, history]) => {
        const latest = history[history.length - 1];
        const isStale =
          (telemetry?.generated_at_sec ?? Math.floor(Date.now() / 1000)) - latest.timestamp_sec >
          STALE_AFTER_SECS;
        const memoryPercent =
          latest.ram_total_mb > 0 ? (latest.ram_used_mb / latest.ram_total_mb) * 100 : 0;
        const diskPercent =
          latest.disk_total_gb > 0 ? (latest.disk_used_gb / latest.disk_total_gb) * 100 : 0;
        const chartData = history.map((sample) => ({
          ...sample,
          memory_used_gb: sample.ram_used_mb / 1024,
          memory_percent:
            sample.ram_total_mb > 0 ? (sample.ram_used_mb / sample.ram_total_mb) * 100 : 0,
        }));
        const gradientId = hostname.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

        return (
          <article key={hostname} className="glass-card node-shell">
            <div className="node-shell-glow" />
            <div className="node-header">
              <div>
                <div className="node-title-row">
                  <h3>{hostname}</h3>
                  <span className={`node-status-pill ${isStale ? "stale" : "live"}`}>
                    {isStale ? "degraded" : "live"}
                  </span>
                </div>
                <div className="node-subtitle">
                  <span>{latest.tailscale_ip}</span>
                  <span>{history.length} samples</span>
                  <span>uptime {formatUptime(latest.uptime_secs)}</span>
                </div>
              </div>

              <div className="node-meta-grid">
                <div className="node-meta-tile">
                  <span className="text-small">Last sample</span>
                  <strong>{formatClock(latest.timestamp_sec)}</strong>
                </div>
                <div className="node-meta-tile">
                  <span className="text-small">Load 1m</span>
                  <strong>{decimalFormatter.format(latest.load_avg_1m)}</strong>
                </div>
              </div>
            </div>

            <div className="metric-grid">
              <MetricTile
                label="CPU Utilization"
                value={`${decimalFormatter.format(latest.cpu_usage)}%`}
                detail="instantaneous core pressure"
                progress={latest.cpu_usage}
                variant="cpu"
              />
              <MetricTile
                label="Memory Footprint"
                value={`${decimalFormatter.format(latest.ram_used_mb / 1024)} GB`}
                detail={`${decimalFormatter.format(memoryPercent)}% of ${decimalFormatter.format(
                  latest.ram_total_mb / 1024,
                )} GB`}
                progress={memoryPercent}
                variant="memory"
              />
              <MetricTile
                label="Disk Occupancy"
                value={`${decimalFormatter.format(latest.disk_used_gb)} GB`}
                detail={`${decimalFormatter.format(diskPercent)}% of ${decimalFormatter.format(
                  latest.disk_total_gb,
                )} GB`}
                progress={diskPercent}
                variant="disk"
              />
            </div>

            <div className="chart-grid">
              <ChartShell title="CPU" caption="Monotone utilization curve">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id={`cpu-line-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7dd3fc" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp_sec"
                      tickFormatter={formatClock}
                      minTickGap={28}
                      tickLine={false}
                      axisLine={false}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      tickLine={false}
                      axisLine={false}
                      width={44}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(125, 211, 252, 0.16)", strokeWidth: 1 }}
                      content={
                        <HistoryTooltip
                          formatValue={(value) => formatTooltipMetric(value, "%")}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="cpu_usage"
                      name="CPU"
                      stroke={`url(#cpu-line-${gradientId})`}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5, fill: "#dff8ff", stroke: "#60a5fa", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartShell>

              <ChartShell title="Memory" caption="Used memory over time">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id={`memory-line-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#f0abfc" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp_sec"
                      tickFormatter={formatClock}
                      minTickGap={28}
                      tickLine={false}
                      axisLine={false}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <YAxis
                      tickFormatter={(value) => `${decimalFormatter.format(value)} GB`}
                      tickLine={false}
                      axisLine={false}
                      width={56}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(240, 171, 252, 0.16)", strokeWidth: 1 }}
                      content={
                        <HistoryTooltip
                          formatValue={(value) => formatTooltipMetric(value, " GB")}
                        />
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="memory_used_gb"
                      name="Used"
                      stroke={`url(#memory-line-${gradientId})`}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5, fill: "#fff0ff", stroke: "#d946ef", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartShell>

              <ChartShell title="Load Average" caption="1m, 5m, and 15m smoothing">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id={`load-1-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                      <linearGradient id={`load-5-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                      <linearGradient id={`load-15-${gradientId}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp_sec"
                      tickFormatter={formatClock}
                      minTickGap={28}
                      tickLine={false}
                      axisLine={false}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={40}
                      stroke="rgba(255,255,255,0.34)"
                    />
                    <Tooltip
                      cursor={{ stroke: "rgba(251, 191, 36, 0.16)", strokeWidth: 1 }}
                      content={<HistoryTooltip />}
                    />
                    <Line
                      type="monotone"
                      dataKey="load_avg_1m"
                      name="1m"
                      stroke={`url(#load-1-${gradientId})`}
                      strokeWidth={2.6}
                      dot={false}
                      activeDot={{ r: 4, fill: "#fff7ed", stroke: "#f59e0b", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="load_avg_5m"
                      name="5m"
                      stroke={`url(#load-5-${gradientId})`}
                      strokeWidth={2.6}
                      dot={false}
                      activeDot={{ r: 4, fill: "#ecfeff", stroke: "#14b8a6", strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="load_avg_15m"
                      name="15m"
                      stroke={`url(#load-15-${gradientId})`}
                      strokeWidth={2.6}
                      dot={false}
                      activeDot={{ r: 4, fill: "#eef2ff", stroke: "#6366f1", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartShell>
            </div>
          </article>
        );
      })}
    </div>
  );
}

#!/usr/bin/env node
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium, devices } from "playwright";

const repoRoot = new URL("../", import.meta.url);
const outputDir = new URL("../.codex-visual/", import.meta.url);
const outputPath = outputDir.pathname;
const defaultUrl = "http://127.0.0.1:3000";
const storageKey = "antimony-dashboard-theme";
const deviceName = "iPhone 12 Pro Max";
const themes = ["light", "dark"];

const args = process.argv.slice(2);
const urlArgIndex = args.indexOf("--url");
const targetUrl = process.env.VISUAL_DEBUG_URL ?? (urlArgIndex >= 0 ? args[urlArgIndex + 1] : defaultUrl);
const chromeBin = process.env.CHROME_BIN ?? "/usr/bin/google-chrome";
const viewport = devices[deviceName];

const requiredSelectors = [
  ".cockpit-home",
  ".home-core-grid",
  ".home-projects-card",
  ".home-infra-card",
  ".home-telemetry-card",
  ".home-openclaw-tray",
];

const requiredSignals = {
  myMantra: ".mantra-button-row button:nth-child(1)",
  llmMantra: ".mantra-button-row button:nth-child(2)",
  projects: ".home-projects-card .summary-label",
  infra: ".home-infra-card .summary-label",
  telemetry: ".home-telemetry-card .summary-label",
  openClawInput: ".home-openclaw-tray input",
};

async function assertChromeExists() {
  try {
    await access(chromeBin);
  } catch {
    throw new Error(`Chrome executable not found at ${chromeBin}. Set CHROME_BIN to a Chromium-compatible browser.`);
  }
}

async function assertDashboardReachable() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(targetUrl, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Dashboard returned HTTP ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Dashboard is not reachable at ${targetUrl}. Start it with npm run dev:lan or restart antimony-dashboard-local.service. ${error.message}`,
    );
  } finally {
    clearTimeout(timeout);
  }
}

function rectToObject(rect) {
  if (!rect) return null;

  return {
    x: Number(rect.x.toFixed(2)),
    y: Number(rect.y.toFixed(2)),
    width: Number(rect.width.toFixed(2)),
    height: Number(rect.height.toFixed(2)),
    top: Number(rect.top.toFixed(2)),
    right: Number(rect.right.toFixed(2)),
    bottom: Number(rect.bottom.toFixed(2)),
    left: Number(rect.left.toFixed(2)),
  };
}

function collectFailures(report) {
  const failures = [];

  if (report.document.horizontalOverflow) {
    failures.push(`horizontal overflow: scrollWidth ${report.document.scrollWidth} > innerWidth ${report.window.innerWidth}`);
  }

  if (report.document.verticalOverflow) {
    failures.push(`vertical overflow: scrollHeight ${report.document.scrollHeight} > innerHeight ${report.window.innerHeight}`);
  }

  for (const selector of requiredSelectors) {
    if (!report.selectors[selector]?.present) {
      failures.push(`missing selector: ${selector}`);
    }
  }

  for (const [name, signal] of Object.entries(report.signals)) {
    if (!signal.ok) {
      failures.push(`missing home signal: ${name}`);
    }
  }

  const tray = report.selectors[".home-openclaw-tray"]?.rect;
  if (tray) {
    if (tray.top < 0) failures.push(`OpenClaw tray starts above viewport: ${tray.top}`);
    if (tray.bottom > report.window.innerHeight - 2) {
      failures.push(`OpenClaw tray is clipped: bottom ${tray.bottom} > ${report.window.innerHeight - 2}`);
    }
  }

  const cockpit = report.selectors[".cockpit-home"]?.rect;
  if (cockpit?.top < 0) {
    failures.push(`cockpit starts above viewport: ${cockpit.top}`);
  }

  return failures;
}

async function captureTheme(browser, theme) {
  const context = await browser.newContext({
    ...viewport,
    colorScheme: theme,
  });

  await context.addInitScript(
    ({ selectedTheme, key }) => {
      window.localStorage.setItem(key, selectedTheme);
      document.documentElement.dataset.theme = selectedTheme;
      document.documentElement.style.colorScheme = selectedTheme;
    },
    { selectedTheme: theme, key: storageKey },
  );

  const page = await context.newPage();
  await page.goto(targetUrl, { waitUntil: "networkidle" });

  await page.evaluate(
    ({ selectedTheme, key }) => {
      window.localStorage.setItem(key, selectedTheme);
      document.documentElement.dataset.theme = selectedTheme;
      document.documentElement.style.colorScheme = selectedTheme;
    },
    { selectedTheme: theme, key: storageKey },
  );

  await page.waitForSelector(".cockpit-home", { timeout: 5000 });

  const screenshotPath = path.join(outputPath, `latest-${deviceName.toLowerCase().replaceAll(" ", "-")}-${theme}.png`);
  await page.screenshot({ fullPage: false, path: screenshotPath });

  const report = await page.evaluate(
    ({ selectors, signals, selectedTheme, key }) => {
      const selectorReport = Object.fromEntries(
        selectors.map((selector) => {
          const element = document.querySelector(selector);
          const rect = element?.getBoundingClientRect();
          const styles = element ? window.getComputedStyle(element) : null;

          return [
            selector,
            {
              present: Boolean(element),
              rect: rect
                ? {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                  }
                : null,
              styles: styles
                ? {
                    backgroundColor: styles.backgroundColor,
                    borderColor: styles.borderColor,
                    borderRadius: styles.borderRadius,
                    color: styles.color,
                    display: styles.display,
                    fontSize: styles.fontSize,
                    overflow: styles.overflow,
                  }
                : null,
            },
          ];
        }),
      );

      const signalReport = Object.fromEntries(
        Object.entries(signals).map(([name, selector]) => {
          const element = document.querySelector(selector);
          const text = element?.textContent?.trim() ?? "";
          const placeholder = element?.getAttribute("placeholder") ?? "";

          return [
            name,
            {
              ok: Boolean(text || placeholder),
              selector,
              text,
              placeholder,
            },
          ];
        }),
      );

      const firstTag = document.querySelector(".state-pill");
      const firstCard = document.querySelector(".home-card");
      const tagStyles = firstTag ? window.getComputedStyle(firstTag) : null;
      const cardStyles = firstCard ? window.getComputedStyle(firstCard) : null;

      return {
        theme: selectedTheme,
        actualTheme: document.documentElement.dataset.theme,
        storedTheme: window.localStorage.getItem(key),
        window: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
        document: {
          clientWidth: document.documentElement.clientWidth,
          clientHeight: document.documentElement.clientHeight,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          verticalOverflow: document.documentElement.scrollHeight > window.innerHeight + 1,
        },
        selectors: selectorReport,
        signals: signalReport,
        primitives: {
          bodyFontSize: window.getComputedStyle(document.body).fontSize,
          firstTag: tagStyles
            ? {
                backgroundColor: tagStyles.backgroundColor,
                borderColor: tagStyles.borderColor,
                borderRadius: tagStyles.borderRadius,
                color: tagStyles.color,
                fontSize: tagStyles.fontSize,
              }
            : null,
          firstCard: cardStyles
            ? {
                backgroundColor: cardStyles.backgroundColor,
                borderColor: cardStyles.borderColor,
                borderRadius: cardStyles.borderRadius,
                color: cardStyles.color,
              }
            : null,
        },
      };
    },
    { selectors: requiredSelectors, signals: requiredSignals, selectedTheme: theme, key: storageKey },
  );

  for (const selector of requiredSelectors) {
    report.selectors[selector].rect = rectToObject(report.selectors[selector].rect);
  }

  report.screenshot = path.relative(repoRoot.pathname, screenshotPath);
  report.failures = collectFailures(report);
  await context.close();

  return report;
}

await mkdir(outputDir, { recursive: true });
await assertChromeExists();
await assertDashboardReachable();

const browser = await chromium.launch({
  executablePath: chromeBin,
  headless: true,
});

try {
  const captures = [];
  for (const theme of themes) {
    captures.push(await captureTheme(browser, theme));
  }

  const report = {
    url: targetUrl,
    device: deviceName,
    generatedAt: new Date().toISOString(),
    captures,
  };

  const reportPath = path.join(outputPath, "latest-report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  const failures = captures.flatMap((capture) => capture.failures.map((failure) => `${capture.theme}: ${failure}`));
  console.log(`Visual debug report: ${path.relative(repoRoot.pathname, reportPath)}`);
  for (const capture of captures) {
    console.log(
      `${capture.theme}: ${capture.screenshot} ${capture.window.innerWidth}x${capture.window.innerHeight}, scroll ${capture.document.scrollWidth}x${capture.document.scrollHeight}`,
    );
  }

  if (failures.length > 0) {
    console.error("Visual debug failures:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}

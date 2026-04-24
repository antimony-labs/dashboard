import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const repoRoot = new URL("../", import.meta.url);
const configRoot = new URL("registry/", repoRoot);

const readText = (url) => readFileSync(url, "utf8");

const parseTsv = (fileName, expectedColumns) => {
  const text = readText(new URL(fileName, configRoot));
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const header = lines.find((line) => line.startsWith("# "));

  assert.ok(header, `${fileName} needs a # header row`);
  assert.deepEqual(
    header.slice(2).split("\t"),
    expectedColumns,
    `${fileName} header changed without updating the contract`,
  );

  return lines
    .filter((line) => !line.startsWith("#"))
    .map((line, index) => {
      const cells = line.split("\t");
      assert.equal(
        cells.length,
        expectedColumns.length,
        `${fileName}:${index + 2} has ${cells.length} cells, expected ${expectedColumns.length}`,
      );

      return Object.fromEntries(expectedColumns.map((column, columnIndex) => [column, cells[columnIndex]]));
    });
};

const extractProjectPortfolioNames = () => {
  const source = readText(new URL("src/data/platform.ts", repoRoot));
  const start = source.indexOf("export const projectPortfolio = [");
  const end = source.indexOf("export const developmentDna", start);

  assert.notEqual(start, -1, "projectPortfolio export is missing");
  assert.notEqual(end, -1, "projectPortfolio end marker is missing");

  return [...source.slice(start, end).matchAll(/\n\s+name: "([^"]+)"/g)].map((match) => match[1]);
};

const luminance = (hex) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrast = (foreground, background) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

const tokenFromBlock = (block, name) => {
  const value = block.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  assert.ok(value, `${name} must be a hex color for contrast checks`);
  return value;
};

test("project reminder registry stays compact and ordered", () => {
  const reminders = parseTsv("project-reminders.tsv", ["project", "priority", "comment"]);
  const byProject = Map.groupBy(reminders, (item) => item.project);

  for (const [project, projectReminders] of byProject) {
    assert.ok(project, "project reminder is missing project name");
    assert.ok(projectReminders.length <= 5, `${project} has more than 5 reminders`);

    const priorities = projectReminders.map((item) => Number(item.priority));
    assert.deepEqual(
      priorities,
      [...priorities].sort((a, b) => a - b),
      `${project} reminders must be priority sorted`,
    );
    assert.deepEqual(
      priorities,
      Array.from({ length: priorities.length }, (_, index) => index + 1),
      `${project} priorities must start at 1 and stay contiguous`,
    );

    for (const reminder of projectReminders) {
      assert.ok(reminder.comment.length <= 140, `${project} reminder is too long for a phone tile`);
    }
  }
});

test("every rendered project tile has LLM reminders", () => {
  const projectNames = extractProjectPortfolioNames();
  const reminders = parseTsv("project-reminders.tsv", ["project", "priority", "comment"]);
  const reminderNames = new Set(reminders.map((item) => item.project));

  assert.ok(projectNames.length > 0, "projectPortfolio must render at least one project");

  for (const name of projectNames) {
    assert.ok(reminderNames.has(name), `${name} is rendered but has no project-reminders.tsv entries`);
  }
});

test("project registry paths stay inside approved anchors", () => {
  const projects = parseTsv("projects.tsv", ["group", "name", "path", "remote", "notes"]);
  const allowedPathPrefixes = [
    "/home/curious/antimony-labs-org",
    "/home/curious/workspace",
  ];

  for (const project of projects) {
    assert.ok(project.name, "project name is required");
    assert.ok(project.notes.length <= 160, `${project.name} notes are too long for compact UI`);

    const isApprovedLocalPath = allowedPathPrefixes.some((prefix) => project.path.startsWith(prefix));
    assert.ok(isApprovedLocalPath, `${project.name} path is outside approved anchors: ${project.path}`);
  }
});

test("launcher settings keep one visible source of truth per tile", () => {
  const settings = parseTsv("dashboard-settings.tsv", ["kind", "key", "value", "notes"]);
  const tileRows = settings.filter((item) => item.kind === "tile");
  const visibleRows = settings.filter((item) => item.kind === "visible");
  const tileKeys = new Set(tileRows.map((item) => item.key));

  assert.equal(tileKeys.size, tileRows.length, "tile order keys must be unique");
  assert.equal(new Set(visibleRows.map((item) => item.key)).size, visibleRows.length, "visible keys must be unique");

  for (const row of tileRows) {
    assert.ok(Number.isInteger(Number(row.value)), `${row.key} tile order must be an integer`);
  }

  for (const row of visibleRows) {
    assert.ok(tileKeys.has(row.key), `${row.key} visibility has no matching tile order row`);
    assert.match(row.value, /^(true|false)$/, `${row.key} visibility must be true or false`);
  }
});

test("dashboard philosophy keeps the six management surfaces", () => {
  const philosophy = parseTsv("dashboard-philosophy.tsv", ["surface", "order", "purpose", "primary_question", "state"]);
  const expectedSurfaces = ["my-mantra", "llm-mantra", "projects", "infra", "telemetry", "openclaw"];
  const pageSource = readText(new URL("src/app/page.tsx", repoRoot));

  assert.deepEqual(
    philosophy.map((item) => item.surface),
    expectedSurfaces,
    "dashboard philosophy must stay ordered around the core surfaces",
  );

  for (const item of philosophy) {
    assert.ok(Number.isInteger(Number(item.order)), `${item.surface} order must be an integer`);
    assert.match(item.state, /^(active|protected|review)$/, `${item.surface} has invalid state`);
    assert.ok(item.purpose.length <= 110, `${item.surface} purpose is too long for fast reading`);
    assert.ok(item.primary_question.length <= 90, `${item.surface} question is too long`);
  }

  assert.match(pageSource, /className="cockpit-home"/, "home must render as cockpit layout");
  assert.match(pageSource, /My Mantra/, "home must keep quick access to personal mantras");
  assert.match(pageSource, /LLM Mantra/, "home must keep quick access to LLM mantras");
  assert.doesNotMatch(pageSource, /className="home-mantra-strip"/, "home should not spend a row on mantra cards");
  assert.match(pageSource, /className="home-core-grid"/, "home must show projects and infra together");
  assert.match(pageSource, /home-telemetry-card/, "telemetry must be visible on the home screen");
  assert.match(pageSource, /className="home-openclaw-tray"/, "OpenClaw input tray must be the home action row");
  assert.doesNotMatch(pageSource, /Operator Dashboard/, "generic dashboard header should not return");
  assert.doesNotMatch(pageSource, /One screen\. Tap for detail/, "instructional header copy should not return");
});

test("openclaw chat is present but honest about bridge state", () => {
  const pageSource = readText(new URL("src/app/page.tsx", repoRoot));

  assert.match(pageSource, /function OpenClawChatPanel/, "OpenClaw chat panel is missing");
  assert.match(pageSource, /Local staging only until the OpenClaw gateway is wired/, "chat must not pretend to be live");
  assert.match(pageSource, /bridge next/, "chat must expose bridge status");
  assert.match(pageSource, /<textarea/, "chat panel needs a message input");
});

test("openclaw mobile inputs do not trigger browser zoom", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.home-openclaw-tray input\s*{[^}]*font-size: var\(--type-input\)/s,
    "home OpenClaw input must be at least 16px on mobile",
  );
  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.openclaw-compose textarea\s*{[^}]*font-size: var\(--type-input\)/s,
    "OpenClaw textarea must be at least 16px on mobile",
  );
  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.main-content:focus-within\s*{[^}]*overflow-y: auto/s,
    "focused cockpit inputs must allow viewport recovery on mobile",
  );
});

test("mobile cockpit does not hard-lock the viewport", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*html,\s*\n\s*body\s*{[^}]*overflow-y: auto/s,
    "mobile page must allow vertical recovery instead of freezing",
  );
  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.dashboard-layout\s*{[^}]*min-height: 100svh/s,
    "mobile layout should use stable viewport height",
  );
  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.dashboard-layout\s*{[^}]*overflow: visible/s,
    "mobile layout must not clip the top when browser chrome changes",
  );
  assert.match(
    cssSource,
    /@media \(max-width: 640px\)[\s\S]*\.cockpit-home\s*{[^}]*grid-template-rows: auto auto auto auto/s,
    "mobile cockpit rows should size naturally",
  );
});

test("iphone pro max cockpit consumes tall viewport without locking", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(
    cssSource,
    /@media \(min-width: 400px\) and \(max-width: 430px\) and \(min-height: 700px\)/,
    "iPhone 12 Pro Max class needs a dedicated layout after mobile browser chrome",
  );
  assert.match(
    cssSource,
    /@media \(min-width: 400px\)[\s\S]*\.dashboard-layout\s*{[^}]*height: 100svh/s,
    "tall-phone cockpit should bind the visible phone viewport",
  );
  assert.match(
    cssSource,
    /@media \(min-width: 400px\)[\s\S]*\.cockpit-home\s*{[^}]*grid-template-rows: auto minmax/s,
    "tall-phone cockpit should allocate extra space to content rows",
  );
  assert.match(
    cssSource,
    /@media \(min-width: 400px\)[\s\S]*\.home-telemetry-card\s*{[^}]*min-height:/s,
    "telemetry should absorb part of the tall-phone bottom space",
  );
});

test("typography uses the dashboard type scale", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));
  const fontSizeValues = [...cssSource.matchAll(/font-size:\s*([^;]+);/g)].map((match) => match[1].trim());
  const allowedValues = new Set([
    "inherit",
    "var(--type-micro)",
    "var(--type-caption)",
    "var(--type-label)",
    "var(--type-small)",
    "var(--type-body)",
    "var(--type-title-sm)",
    "var(--type-title)",
    "var(--type-title-lg)",
    "var(--type-display)",
    "var(--type-input)",
  ]);

  assert.match(cssSource, /--type-input:\s*16px;/, "input token must stay 16px to avoid iOS zoom");
  assert.ok(fontSizeValues.length > 0, "CSS should define font sizes through the type scale");

  for (const value of fontSizeValues) {
    assert.ok(allowedValues.has(value), `font-size must use a type token, found: ${value}`);
  }
});

test("home typography uses semantic theme colors", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(
    cssSource,
    /\.home-card-hit strong\s*{[^}]*color: var\(--text-primary\)/s,
    "home card headings must work in both light and dark themes",
  );
  assert.match(
    cssSource,
    /\.home-infra-metrics strong\s*{[^}]*color: var\(--text-primary\)/s,
    "home infra metric values must not be hard-coded white",
  );
  assert.match(
    cssSource,
    /\.openclaw-tray-project strong\s*{[^}]*color: var\(--text-primary\)/s,
    "OpenClaw tray title must not be hard-coded white",
  );
});

test("layout rhythm uses spacing and radius tokens", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));
  const layoutDeclarations = [
    ...cssSource.matchAll(
      /\b(?<property>padding(?:-(?:top|right|bottom|left)|-inline|-block)?|margin(?:-(?:top|right|bottom|left)|-inline|-block)?|gap|row-gap|column-gap|border-radius):\s*(?<value>[^;]+);/g,
    ),
  ];

  for (const token of [
    "--space-1",
    "--space-2",
    "--space-3",
    "--space-4",
    "--radius-card",
    "--radius-pill",
    "--shadow-panel-dark",
  ]) {
    assert.match(cssSource, new RegExp(`${token}:`), `${token} token is missing`);
  }

  assert.ok(layoutDeclarations.length > 0, "layout declarations should be tokenized");

  for (const match of layoutDeclarations) {
    const { property, value } = match.groups;
    if (property === "border-radius") {
      assert.doesNotMatch(value, /\b\d+px\b|50%|999px/, `border-radius must use radius tokens: ${value}`);
    } else {
      assert.doesNotMatch(value, /\b\d*\.?\d+rem\b|\b\d+px\b/, `${property} must use spacing tokens: ${value}`);
    }
  }
});

test("surface primitives cover repeated dashboard cards", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(cssSource, /\.surface-card,\s*\n:where\(/, "surface card primitive is missing");
  assert.match(cssSource, /\.surface-row,\s*\n:where\(/, "surface row primitive is missing");

  for (const selector of [
    ".home-card",
    ".secret-summary",
    ".project-program-card",
    ".infra-card",
    ".domain-row",
    ".ops-node",
    ".metric-tile",
  ]) {
    assert.match(cssSource, new RegExp(selector.replace(".", "\\.")), `${selector} must be covered by primitives`);
  }
});

test("project panel keeps the program manager contract", () => {
  const pageSource = readText(new URL("src/app/page.tsx", repoRoot));
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));

  assert.match(pageSource, /className="project-program-card"/, "projects must be grouped into program cards");
  assert.match(pageSource, /current bet/, "program cards must show the current bet");
  assert.match(pageSource, /next decision/, "program cards must show the next decision");
  assert.match(pageSource, /project-decision-lane/, "project work must be grouped by decision lane");
  assert.match(pageSource, /projectReminders\[project\.name\]\?\.\[0\]/, "project rows should show one focused reminder");
  assert.doesNotMatch(pageSource, /LLM TODO/, "project panel should not dump TODO blocks");
  assert.match(cssSource, /\.project-program-board\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(cssSource, /\.project-decision-board\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(cssSource, /@media \(max-width: 640px\)[\s\S]*\.project-program-board,[\s\S]*\.project-decision-board,[\s\S]*grid-template-columns: 1fr/s);
});

test("light theme text tokens keep readable contrast", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));
  const lightTheme = cssSource.match(/\[data-theme="light"\]\s*{(?<body>[^}]+)}/)?.groups?.body;

  assert.ok(lightTheme, "light theme token block is missing");

  const whiteCard = "#ffffff";

  assert.ok(contrast(tokenFromBlock(lightTheme, "--text-primary"), whiteCard) >= 12, "primary text contrast is too low");
  assert.ok(contrast(tokenFromBlock(lightTheme, "--text-secondary"), whiteCard) >= 8, "secondary text contrast is too low");
  assert.ok(contrast(tokenFromBlock(lightTheme, "--text-tertiary"), whiteCard) >= 5.5, "tertiary text contrast is too low");
});

test("dark theme text tokens keep readable contrast", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));
  const rootTheme = cssSource.match(/:root\s*{(?<body>[^}]+)}/)?.groups?.body;

  assert.ok(rootTheme, "root dark theme token block is missing");

  const darkCard = tokenFromBlock(rootTheme, "--bg-deep");

  assert.ok(contrast(tokenFromBlock(rootTheme, "--text-primary"), darkCard) >= 14, "dark primary text contrast is too low");
  assert.ok(contrast(tokenFromBlock(rootTheme, "--text-secondary"), darkCard) >= 9, "dark secondary text contrast is too low");
  assert.ok(contrast(tokenFromBlock(rootTheme, "--text-tertiary"), darkCard) >= 5.5, "dark tertiary text contrast is too low");
});

test("readability guidelines are compact structured records", () => {
  const guidelines = parseTsv("readability-guidelines.tsv", ["group", "priority", "rule", "why", "state"]);
  const requiredGroups = new Set(["contrast", "typography", "layout", "llm"]);
  const groups = new Set(guidelines.map((item) => item.group));

  for (const group of requiredGroups) {
    assert.ok(groups.has(group), `readability guidelines need ${group} rules`);
  }

  for (const item of guidelines) {
    assert.match(item.state, /^(active|protected|review)$/, `${item.rule} has invalid state`);
    assert.ok(Number.isInteger(Number(item.priority)), `${item.rule} priority must be an integer`);
    assert.ok(item.rule.length <= 130, `${item.rule} is too long for LLM-fast reading`);
    assert.ok(item.why.length <= 120, `${item.rule} why field is too long`);
  }
});

test("project management guidelines keep the panel product-led", () => {
  const guidelines = parseTsv("project-management-guidelines.tsv", ["group", "priority", "rule", "why", "state"]);
  const requiredGroups = new Set(["program", "llm", "product"]);
  const groups = new Set(guidelines.map((item) => item.group));

  for (const group of requiredGroups) {
    assert.ok(groups.has(group), `project management guidelines need ${group} rules`);
  }

  for (const item of guidelines) {
    assert.match(item.state, /^(active|protected|review)$/, `${item.rule} has invalid state`);
    assert.ok(Number.isInteger(Number(item.priority)), `${item.rule} priority must be an integer`);
    assert.ok(item.rule.length <= 130, `${item.rule} is too long for phone-first reading`);
    assert.ok(item.why.length <= 120, `${item.rule} why field is too long`);
  }
});

test("status indicators render as tags, not bubbles", () => {
  const cssSource = readText(new URL("src/app/globals.css", repoRoot));
  const stateTag = cssSource.match(/^\.tag,\s*\n\.state-pill\s*{(?<body>[^}]+)}/m)?.groups?.body;
  const launcherTag = cssSource.match(/^\.launcher-state\s*{(?<body>[^}]+)}/m)?.groups?.body;
  const apiTag = cssSource.match(/^\.api-status-badge\s*{(?<body>[^}]+)}/m)?.groups?.body;

  assert.ok(stateTag, "state tag style is missing");
  assert.ok(launcherTag, "launcher tag style is missing");
  assert.ok(apiTag, "api status tag style is missing");

  for (const [name, block] of Object.entries({ stateTag, launcherTag, apiTag })) {
    assert.match(block, /border-left-width:\s*[23]px/, `${name} must use a tag accent edge`);
    assert.doesNotMatch(block, /border-radius:\s*999px/, `${name} must not be pill-shaped`);
  }

  assert.match(cssSource, /\.tag-success\s*{[^}]*--tag-bg: var\(--tag-success-bg\)/s);
  assert.match(cssSource, /\.tag-warning\s*{[^}]*--tag-bg: var\(--tag-warning-bg\)/s);
  assert.match(cssSource, /\.tag-danger\s*{[^}]*--tag-bg: var\(--tag-danger-bg\)/s);
  assert.match(cssSource, /\.state-pill\.active[\s\S]*--tag-bg: var\(--tag-success-bg\)/s);
});

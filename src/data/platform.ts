export const domainSurfaces = [
  {
    domain: "antimony-labs.com",
    role: "Public research landing",
    state: "live",
    audience: "public",
  },
  {
    domain: "dashboard.antimony-labs.com",
    role: "Private operator cockpit",
    state: "live",
    audience: "gated",
  },
  {
    domain: "antimony-labs.org",
    role: "Research mirror / redirect policy",
    state: "redirecting",
    audience: "public",
  },
  {
    domain: "shivambhardwaj.com",
    role: "Personal portfolio and resume",
    state: "needs canonical site",
    audience: "public",
  },
  {
    domain: "too.foo",
    role: "Public app garden",
    state: "live",
    audience: "public",
  },
  {
    domain: "e51.org",
    role: "Element 51 product surface",
    state: "live",
    audience: "public",
  },
];

export const dashboardSettings = {
  defaultPanel: "none",
  mobilePolicy: "compact-groups",
  refreshButton: true,
};

export const launcherTileSettings = [
  {
    id: "dna",
    settingsKey: "llm-mantra",
    order: 10,
    visible: true,
  },
  {
    id: "mantras",
    settingsKey: "my-mantra",
    order: 5,
    visible: true,
  },
  {
    id: "projects",
    settingsKey: "projects",
    order: 20,
    visible: true,
  },
  {
    id: "infra",
    settingsKey: "infra",
    order: 30,
    visible: true,
  },
  {
    id: "telemetry",
    settingsKey: "telemetry",
    order: 40,
    visible: true,
  },
  {
    id: "openclaw",
    settingsKey: "openclaw",
    order: 50,
    visible: true,
  },
  {
    id: "secrets",
    settingsKey: "secrets",
    order: 90,
    visible: false,
  },
  {
    id: "shortcuts",
    settingsKey: "shortcuts",
    order: 91,
    visible: false,
  },
  {
    id: "nodes",
    settingsKey: "machine",
    order: 92,
    visible: false,
  },
  {
    id: "domains",
    settingsKey: "domains",
    order: 93,
    visible: false,
  },
  {
    id: "backups",
    settingsKey: "rebuild",
    order: 94,
    visible: false,
  },
  {
    id: "actions",
    settingsKey: "next",
    order: 80,
    visible: false,
  },
];

export const dashboardAccessModes = [
  {
    name: "Local hot reload",
    endpoint: "http://127.0.0.1:3000 or Next dev port",
    use: "Fast iteration on this machine while editing.",
    auth: "local only",
    state: "keep",
  },
  {
    name: "LAN phone review",
    endpoint: "http://10.0.0.114:3000",
    use: "Phone testing on the same network.",
    auth: "network boundary",
    state: "active",
  },
  {
    name: "Remote phone access",
    endpoint: "dashboard.antimony-labs.com",
    use: "Access from any phone after one-time authentication.",
    auth: "Cloudflare Access or equivalent identity gate",
    state: "next",
  },
  {
    name: "Raw port forward",
    endpoint: "Xfinity public port -> sbl1:3000",
    use: "Avoid unless protected by an auth proxy.",
    auth: "not enough by itself",
    state: "blocked",
  },
];

export const projectProductivityLanes = [
  {
    name: "Active build",
    signal: "What deserves hours today.",
    action: "Keep this short; one or two active projects only.",
    state: "active",
  },
  {
    name: "Git hygiene",
    signal: "Dirty repos block safe delegation.",
    action: "Commit, shelve, or explicitly ignore before larger moves.",
    state: "review",
  },
  {
    name: "Machine rebuild",
    signal: "Backups and cleanup are a project, not a permanent top-level dashboard tile.",
    action: "Track semantic absorption, prune candidates, and retirement decisions under Projects.",
    state: "active",
  },
  {
    name: "Remote dashboard",
    signal: "Any-phone access needs auth without losing local hot reload.",
    action: "Keep local/LAN modes; add an authenticated remote route as a separate deployment mode.",
    state: "next",
  },
];

export const projectOperatingPrinciples = [
  {
    name: "Outcome before repo",
    rule: "Every project should answer what it changes for the user before discussing files, remotes, or cleanup.",
    state: "protected",
  },
  {
    name: "One active bet",
    rule: "The dashboard should make the next few hours obvious; everything else is sequenced, parked, or delegated.",
    state: "active",
  },
  {
    name: "LLM as partner",
    rule: "The LLM should surface decisions, risks, and next actions, not merely summarize the filesystem.",
    state: "active",
  },
];

export const projectPrograms = [
  {
    name: "Operator dashboard",
    outcome: "A phone-first cockpit for decisions, machine state, secrets metadata, and LLM collaboration.",
    currentBet: "Make the dashboard trustworthy enough to guide daily development.",
    nextDecision: "Generate live project state from registries and git instead of hand-maintained data.",
    risk: "Dashboard becomes another static report if state is not generated.",
    projects: ["dashboard", "fleet"],
    state: "active",
  },
  {
    name: "Antimony platform",
    outcome: "Private umbrella for infra, agents, deployment, and the core system behind public surfaces.",
    currentBet: "Define core and fleet before cloning/building too many services.",
    nextDecision: "Decide whether core is API gateway, agent runtime, or both.",
    risk: "Premature repos create architecture theater instead of a working platform.",
    projects: ["core", "magnetism-mc-api", "second-brain"],
    state: "designing",
  },
  {
    name: "Public app garden",
    outcome: "too.foo/e51 becomes the public surface for AI-generated apps, writing, demos, and experiments.",
    currentBet: "Clarify the relationship between too.foo, e51, portfolio, and content pipelines.",
    nextDecision: "Choose one first public app/story to ship through the pipeline.",
    risk: "Too many surfaces split identity before the platform has a rhythm.",
    projects: ["e51", "content.too.foo", "s3m2p", "kaggle"],
    state: "next",
  },
  {
    name: "Machine rebuild",
    outcome: "Clean roots, retired sbl2 laptop, protected secrets, and reproducible project ownership.",
    currentBet: "Treat cleanup as program work, not background chores.",
    nextDecision: "Turn project state generation into the source of truth before pruning deeper.",
    risk: "Cleanup without ownership decisions either loses context or preserves too much.",
    projects: ["books", "nasa-trajectory-explorer", "vast-model-lab", "stretch_isaac_sim"],
    state: "review",
  },
];

export const projectDecisionLanes = [
  {
    name: "Build now",
    intent: "Only the work that should receive active hours before expanding scope.",
    ask: "Improve the dashboard until it can drive the rest of the machine work.",
    projects: ["dashboard"],
    state: "active",
  },
  {
    name: "Decide next",
    intent: "Ambiguous but important pieces that need a product/architecture decision.",
    ask: "Resolve purpose before implementation.",
    projects: ["core", "fleet", "e51", "magnetism-mc-api", "content.too.foo"],
    state: "next",
  },
  {
    name: "Consolidate",
    intent: "Existing work with value, but mixed ownership, dirty state, or archive overlap.",
    ask: "Classify source/generated/archive and pick canonical homes.",
    projects: ["second-brain", "books", "s3m2p", "kaggle"],
    state: "review",
  },
  {
    name: "Park or productize",
    intent: "Labs and vendor checkouts should not compete with active platform decisions.",
    ask: "Keep clean unless a lab becomes a deliberate product surface.",
    projects: ["nasa-trajectory-explorer", "vast-model-lab", "stretch_isaac_sim", "IsaacLab", "stable-diffusion-webui"],
    state: "guarded",
  },
];

export const projectReminders: Record<string, string[]> = {
  dashboard: [
    "Current dashboard work is uncommitted; commit after the tile/infra redesign settles.",
    "Keep phone layout as the source of truth; avoid wide desktop-only decisions.",
    "Next technical step is generated dashboard state from config TSV files.",
    "Remote access should use auth proxy/tunnel without breaking local hot reload.",
  ],
  core: [
    "Remote repo exists but is not cloned on sbl1.",
    "Decide whether this becomes the platform API gateway or stays empty.",
    "Clone only after dashboard/product surface decisions are clearer.",
  ],
  fleet: [
    "Remote repo exists but no local checkout is active.",
    "Should become machine signals and service health feed for the dashboard.",
    "Define minimal telemetry before building agents around it.",
  ],
  e51: [
    "Public repo exists; local source is not consolidated.",
    "Clarify relationship between e51.org and too.foo before investing.",
    "Treat as product surface, not infrastructure.",
  ],
  "magnetism-mc-api": [
    "Dirty local repo; inspect changes before moving more screenshot/service logic.",
    "Screenshot sync paths were moved and service currently depends on this project.",
    "Decide whether screenshot bridge should live here or in its own package.",
  ],
  "second-brain": [
    "Parent repo has imported sbl2 directories; classify nested repos before committing.",
    "Keep PWA/knowledge-system direction separate from archive absorption.",
    "Books and secondbrain nested repos need ownership decisions.",
  ],
  books: [
    "Local branch is ahead by 8 commits; resolve before major consolidation.",
    "Token/repo access is restricted; fix auth before pushing.",
    "Treat as creative engine with explicit source/generated boundaries.",
  ],
  s3m2p: [
    "Large dirty public workspace; identify current active app before cleanup.",
    "Contains personal-data-organizer manifests; avoid broad searches if not needed.",
    "Decide what belongs on personal GitHub vs Antimony platform.",
  ],
  "content.too.foo": [
    "Fetch blocked with current credentials; fix GitHub access.",
    "Separate generated renders/assets from source decisions.",
    "This likely becomes too.foo content/app garden pipeline.",
  ],
  kaggle: [
    "Largest workspace at 62G; classify competitions vs reusable code.",
    "Kaggle secrets need re-entry into sbl0 vault.",
    "Avoid committing datasets or generated notebooks by accident.",
  ],
  "nasa-trajectory-explorer": [
    "Local Rust project has no upstream; decide publish/archive path.",
    "Small enough to clean and make canonical quickly.",
  ],
  "vast-model-lab": [
    "Local non-git lab; decide whether it should become a repo.",
    "Keep evaluation results separate from source code.",
  ],
  stretch_isaac_sim: [
    "Local sim assets and venv; classify source assets vs rebuildable environment.",
    "Decide whether this belongs under robotics workspace or Antimony labs.",
  ],
  IsaacLab: [
    "Third-party vendor checkout; keep clean and avoid local edits.",
    "Use as dependency/reference, not a project to own.",
  ],
  "stable-diffusion-webui": [
    "Third-party vendor checkout with one local change.",
    "Capture the local change purpose or reset only with explicit approval.",
  ],
};

export const projectMantras = [
  {
    priority: 1,
    group: "aesthetics",
    name: "Intentional beauty",
    mantra: "Make every surface feel chosen, not generated.",
    prompt: "Does this have a visual point of view or is it just filling space?",
    state: "active",
  },
  {
    priority: 2,
    group: "ease",
    name: "Phone cockpit",
    mantra: "If it cannot be understood on the phone in ten seconds, compress it.",
    prompt: "What can be grouped, hidden, or revealed only on tap?",
    state: "active",
  },
  {
    priority: 3,
    group: "security",
    name: "Protected by default",
    mantra: "Metadata can be visible; sensitive values stay encrypted and injected only when needed.",
    prompt: "Are we showing names and usage without exposing the secret?",
    state: "protected",
  },
  {
    priority: 4,
    group: "llm",
    name: "Structured truth",
    mantra: "Facts belong in small records that LLMs can diff, update, and reason over.",
    prompt: "Is this a stable field or a paragraph pretending to be state?",
    state: "active",
  },
  {
    priority: 5,
    group: "projects",
    name: "Source before archive",
    mantra: "Source, generated output, runtime, cache, and archive must be separate.",
    prompt: "What category is this item before we move or delete it?",
    state: "active",
  },
  {
    priority: 6,
    group: "workflow",
    name: "Small reversible moves",
    mantra: "Prefer small changes with verification over big reorganizations.",
    prompt: "Can this be undone or audited later?",
    state: "active",
  },
  {
    priority: 7,
    group: "psychology",
    name: "Reduce cognitive load",
    mantra: "The system should make the next good decision obvious.",
    prompt: "What anxiety or ambiguity can this UI remove?",
    state: "active",
  },
  {
    priority: 8,
    group: "ambition",
    name: "One app mindset",
    mantra: "Assume teaching, learning, building, maintaining, and publishing can converge.",
    prompt: "Does this make the platform more unified or more fragmented?",
    state: "active",
  },
  {
    priority: 9,
    group: "automation",
    name: "Agents need rails",
    mantra: "LLMs should have strong rules, compact context, and safe defaults.",
    prompt: "What guardrail prevents the agent from doing the wrong impressive thing?",
    state: "active",
  },
  {
    priority: 10,
    group: "taste",
    name: "No generic slop",
    mantra: "If it looks or reads like a template, sharpen the opinion.",
    prompt: "What would make this unmistakably ours?",
    state: "active",
  },
];

export const operatingNodes = [
  {
    id: "sbl1",
    role: "workstation / local control",
    signal: "LAN 10.0.0.114",
    state: "online",
  },
  {
    id: "sbl4",
    role: "deployment worker",
    signal: "SSH timed out from sbl1",
    state: "blocked",
  },
  {
    id: "openclaw",
    role: "Discord control plane",
    signal: "token pending",
    state: "staged",
  },
  {
    id: "api",
    role: "fleet + platform gateway",
    signal: "api.antimony-labs.com unresolved",
    state: "missing",
  },
];

export const machineFacts = [
  {
    label: "Host",
    value: "sbl1",
    detail: "Ubuntu 24.04 workstation / local control node",
    state: "online",
  },
  {
    label: "LAN",
    value: "10.0.0.114",
    detail: "phone-accessible dashboard endpoint",
    state: "online",
  },
  {
    label: "Tailscale",
    value: "100.120.241.78",
    detail: "private mesh address detected locally",
    state: "online",
  },
  {
    label: "Root disk",
    value: "74% used",
    detail: "457G total, 320G used, 114G available after backup prune",
    state: "online",
  },
  {
    label: "Dashboard service",
    value: "enabled / active",
    detail: "antimony-dashboard-local.service on port 3000",
    state: "online",
  },
  {
    label: "OpenClaw gateway",
    value: "vault-ready / inactive",
    detail: "wrappers now pull Discord and gateway tokens from sbl0 vault",
    state: "staged",
  },
  {
    label: "Secret source",
    value: "sbl0 vault",
    detail: "OpenClaw, Kimi, GitHub, and Kaggle wrappers use sbl-secret-env; local OpenClaw/Kaggle/GitHub token files removed",
    state: "online",
  },
];

const secretInventoryTsv = `
cloudflare	cloudflare-account-id	sbl0 vault	no local file	dns/deploy	2026-02-18
cloudflare	cloudflare-api-token	sbl0 vault	no local file	dns/deploy	2026-02-18
cloudflare	cloudflare-global-api-key	sbl0 vault	no local file	dns/deploy	2026-02-18
cloudflare	cloudflare-origin-key-too-foo	sbl0 vault	no local file	too.foo origin	2026-02-18
cloudflare	cloudflare-zone-id-antimony-labs-com	sbl0 vault	no local file	antimony-labs.com	2026-02-18
cloudflare	cloudflare-zone-id-antimony-labs-org	sbl0 vault	no local file	antimony-labs.org	2026-02-18
cloudflare	cloudflare-zone-id-e51-org	sbl0 vault	no local file	e51.org	2026-02-18
cloudflare	cloudflare-zone-id-shivambhardwaj-com	sbl0 vault	no local file	shivambhardwaj.com	2026-02-18
cloudflare	cloudflare-zone-id-too-foo	sbl0 vault	no local file	too.foo	2026-02-18
deploy	contabo-deploy-ssh-key	sbl0 vault	no local file	deployment worker	2026-02-18
discord	discord-bot-token	sbl0 vault	no local file	openclaw shared fallback	2026-02-18
git	git-email	sbl0 vault	no local file	git identity	2026-02-12
git	git-name	sbl0 vault	no local file	git identity	2026-02-12
github	github-token	sbl0 vault	no local file	repo_policy.py	2026-04-23
llm	sbl0-moonshot-api-key	sbl0 vault	no local file	kimi / kimi-cli	2026-04-21
sbl1	sbl1-krishna-groq-api-key	sbl0 vault	no local file	krishna/sbl1	2026-03-08
sbl1	sbl1-krishna-xai-api-key	sbl0 vault	no local file	krishna/sbl1	2026-03-08
sbl1	sbl1-openclaw-discord-token	sbl0 vault	no local file	openclaw-discord-gateway	2026-03-08
sbl1	sbl1-openclaw-gateway-token	sbl0 vault	no local file	openclaw-discord-gateway	2026-03-08
sbl1	sbl1-openclaw-ollama-api-key	sbl0 vault	no local file	openclaw/sbl1	2026-03-08
sbl3	sbl3-openclaw-auth-anthropic-token	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-auth-xai-api-key	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-discord-token	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-gateway-token	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-gemini-api-key	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-gog-keyring-password	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-groq-api-key	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-openclaw-moonshot-api-key	sbl0 vault	no local file	openclaw/sbl3	2026-03-08
sbl3	sbl3-openclaw-xai-api-key	sbl0 vault	no local file	openclaw/sbl3	2026-03-07
sbl3	sbl3-smart-router-anthropic-api-key	sbl0 vault	no local file	smart-router/sbl3	2026-03-07
sbl3	sbl3-smart-router-xai-api-key	sbl0 vault	no local file	smart-router/sbl3	2026-03-07
sbl4	sbl4-krishna-groq-api-key	sbl0 vault	no local file	krishna/sbl4	2026-03-08
sbl4	sbl4-krishna-xai-api-key	sbl0 vault	no local file	krishna/sbl4	2026-03-08
sbl4	sbl4-openclaw-anthropic-api-key	sbl0 vault	no local file	openclaw/sbl4	2026-03-08
sbl4	sbl4-openclaw-discord-token	sbl0 vault	no local file	openclaw/sbl4	2026-03-08
sbl4	sbl4-openclaw-gateway-token	sbl0 vault	no local file	openclaw/sbl4	2026-03-08
sbl4	sbl4-openclaw-groq-api-key	sbl0 vault	no local file	openclaw/sbl4	2026-03-08
sbl4	sbl4-openclaw-xai-api-key	sbl0 vault	no local file	openclaw/sbl4	2026-03-08
sbl4	sbl4-plos-ingest-discord-token	sbl0 vault	no local file	plos ingest/sbl4	2026-03-08
ssh	ssh-ed25519-private	sbl0 vault	no local file	emergency ssh identity	2026-02-12
kaggle	kaggle-username	missing	needs re-entry	run-kaggle-dashboard.sh	missing
kaggle	kaggle-key	missing	needs re-entry	run-kaggle-dashboard.sh	missing
kaggle	kaggle-api-token	missing	needs re-entry	run-kaggle-dashboard.sh	missing
gcloud	gcloud-credentials	app local	local app auth	gcloud	2026-03-08
claude	claude-credentials	app local	local app auth	claude	2026-03-03
antigravity	antigravity-token	app local	local app auth	antigravity	2026-04-21
sunshine	sunshine-credentials	app local	local app auth	sunshine	2026-04-04
`.trim();

export const secretInventory = secretInventoryTsv.split("\n").map((line) => {
  const [scope, name, source, localStatus, consumer, lastUpdated] = line.split("\t");
  return {
    scope,
    name,
    source,
    localStatus,
    consumer,
    lastUpdated,
    state: source === "sbl0 vault" ? "vault" : source === "missing" ? "missing" : "local-app-auth",
  };
});

export const secretPolicy = [
  {
    name: "Metadata visible",
    rule: "The dashboard may show secret names, consumers, source of truth, and update timestamps.",
    state: "active",
  },
  {
    name: "Values never rendered",
    rule: "Secret values stay encrypted on sbl0 and are only injected into a process environment at launch.",
    state: "protected",
  },
  {
    name: "One command store",
    rule: "Use secret-store NAME SCOPE CONSUMER to encrypt a new value on sbl0 and update the dashboard registry metadata.",
    state: "active",
  },
  {
    name: "Local app auth is explicit",
    rule: "OAuth databases and app-managed login files are visible as exceptions until each app gets a migration plan.",
    state: "review",
  },
];

export const llmCheckPrinciples = [
  {
    name: "Compact first",
    rule: "Rules should render as grouped rows with stable fields, not as prose blocks.",
    state: "active",
  },
  {
    name: "Guardrails visible",
    rule: "Dangerous operations, secrets, and backup searches must be visible as protected checks.",
    state: "protected",
  },
  {
    name: "Phone review",
    rule: "If a rule cannot be scanned on the phone, compress it before adding more detail.",
    state: "active",
  },
];

export const llmChecks = [
  {
    group: "context",
    name: "Read current state",
    check: "Inspect relevant files, services, and registries before editing.",
    why: "Prevents stale assumptions.",
    state: "active",
  },
  {
    group: "context",
    name: "Exclude backups",
    check: "Do not broad-search backups unless the task is specifically about backup content.",
    why: "Archived logs may contain secrets and high-noise generated state.",
    state: "protected",
  },
  {
    group: "context",
    name: "Trust registries",
    check: "Prefer config/*.tsv and dashboard data before prose files.",
    why: "Small records are faster for LLMs.",
    state: "active",
  },
  {
    group: "edits",
    name: "Use apply_patch",
    check: "Manual source edits must go through apply_patch.",
    why: "Keeps diffs intentional.",
    state: "active",
  },
  {
    group: "edits",
    name: "Respect dirty work",
    check: "Check git status and never revert unrelated user edits.",
    why: "The machine may contain active user work.",
    state: "protected",
  },
  {
    group: "edits",
    name: "Update UI state",
    check: "When changing process state, update structured data and dashboard surface.",
    why: "The phone view should match the machine.",
    state: "active",
  },
  {
    group: "safety",
    name: "No secret values",
    check: "Show names, consumers, source, and timestamps only.",
    why: "Values stay encrypted on sbl0.",
    state: "protected",
  },
  {
    group: "safety",
    name: "Dry-run first",
    check: "Cleanup scripts must default to dry-run and require explicit apply/delete.",
    why: "Backups are expensive to reconstruct.",
    state: "protected",
  },
  {
    group: "safety",
    name: "No blind deletes",
    check: "Delete only after classification or explicit user approval.",
    why: "Organization must not become data loss.",
    state: "protected",
  },
  {
    group: "mobile",
    name: "No sideways scroll",
    check: "Top-level and panel layouts must fit phone width.",
    why: "Phone is the review surface.",
    state: "active",
  },
  {
    group: "mobile",
    name: "Compact groups",
    check: "Group long lists by scope and collapse repeated labels.",
    why: "Improves scan speed.",
    state: "active",
  },
  {
    group: "mobile",
    name: "Tap for details",
    check: "Launcher stays small; details live in focused overlays.",
    why: "Keeps the home screen stable.",
    state: "active",
  },
  {
    group: "readability",
    name: "Theme contrast",
    check: "Primary, secondary, and tertiary text tokens must pass contrast checks in light and dark themes.",
    why: "Visual polish cannot weaken readability.",
    state: "protected",
  },
  {
    group: "readability",
    name: "Readable facts",
    check: "Do not use decorative gray or ultra-light weight for facts, paths, TODOs, or state labels.",
    why: "Dense phone tiles need fast scanning.",
    state: "protected",
  },
  {
    group: "readability",
    name: "Clamp not shrink",
    check: "Clamp long text and reveal detail on tap instead of shrinking fonts below readable sizes.",
    why: "Information hierarchy beats tiny text.",
    state: "active",
  },
  {
    group: "deployment",
    name: "Build before restart",
    check: "Run lint and build before restarting a dashboard service.",
    why: "Catches TypeScript/static export errors.",
    state: "active",
  },
  {
    group: "deployment",
    name: "Verify endpoint",
    check: "Check HTTP 200 after service restart.",
    why: "Confirms LAN deployment is serving.",
    state: "active",
  },
  {
    group: "projects",
    name: "Classify artifacts",
    check: "Separate source, generated, cache, runtime, and archive before moving.",
    why: "Keeps rebuilds possible.",
    state: "active",
  },
  {
    group: "projects",
    name: "Promote shortcuts",
    check: "If a command is useful twice, add it to Shortcuts.",
    why: "Builds memory without Markdown.",
    state: "active",
  },
  {
    group: "communication",
    name: "Final state",
    check: "Report what changed, what was verified, and what remains risky.",
    why: "Keeps collaboration actionable.",
    state: "active",
  },
];

export const shortcutPrinciples = [
  {
    name: "Read before run",
    rule: "Shortcuts show exact commands, but the dashboard does not execute them. Run them intentionally from a shell or agent.",
    state: "active",
  },
  {
    name: "Prefer dry-run",
    rule: "Cleanup and migration shortcuts should default to status or dry-run before any apply/delete action.",
    state: "guarded",
  },
  {
    name: "Store the pattern",
    rule: "If a command becomes useful twice, promote it into this registry with purpose, safety, and usage.",
    state: "active",
  },
];

export const shortcutInventory = [
  {
    group: "secrets",
    name: "Store a secret",
    command: "secret-store NAME SCOPE CONSUMER",
    use: "Encrypts a new secret on sbl0 and updates the dashboard metadata registry.",
    example: "secret-store kaggle-key kaggle run-kaggle-dashboard.sh",
    state: "guarded",
  },
  {
    group: "secrets",
    name: "List vault names",
    command: "sbl-secret list",
    use: "Shows secret names only. Values are not printed.",
    example: "sbl-secret list | sort",
    state: "safe",
  },
  {
    group: "secrets",
    name: "Run with secret env",
    command: "sbl-secret-env ENV_NAME=secret-name -- command",
    use: "Injects one vault secret into one process without writing a local env file.",
    example: "sbl-secret-env GITHUB_TOKEN=github-token -- gh auth status",
    state: "guarded",
  },
  {
    group: "dashboard",
    name: "Change tile order",
    command: "edit antimony-labs-org/config/dashboard-settings.tsv",
    use: "Adjust tile order numbers or visibility, then mirror into launcherTileSettings and rebuild.",
    example: "Set tile secrets to 20 and projects to 30, then rebuild dashboard.",
    state: "guarded",
  },
  {
    group: "dashboard",
    name: "Rebuild dashboard",
    command: "npm run lint && npm run build && systemctl --user restart antimony-dashboard-local.service",
    use: "Applies dashboard data/UI changes to the LAN-served static build.",
    example: "cd ~/antimony-labs-org/projects/antimony-labs/dashboard && npm run lint && npm run build && systemctl --user restart antimony-dashboard-local.service",
    state: "safe",
  },
  {
    group: "dashboard",
    name: "Check local endpoint",
    command: "curl -I http://127.0.0.1:3000",
    use: "Confirms the dashboard server is responding after a restart.",
    example: "curl -sS -I http://127.0.0.1:3000 | sed -n '1,8p'",
    state: "safe",
  },
  {
    group: "dashboard",
    name: "Service status",
    command: "systemctl --user status antimony-dashboard-local.service",
    use: "Shows whether the LAN dashboard service is active and where it is running from.",
    example: "systemctl --user --no-pager --plain status antimony-dashboard-local.service",
    state: "safe",
  },
  {
    group: "projects",
    name: "Project status",
    command: "project-status",
    use: "Reads the project registry and shows clean/dirty/missing state.",
    example: "~/antimony-labs-org/bin/project-status",
    state: "safe",
  },
  {
    group: "projects",
    name: "Current git dirt",
    command: "git status --short",
    use: "Fast local check before moving, committing, or asking an agent to edit.",
    example: "git status --short",
    state: "safe",
  },
  {
    group: "screenshots",
    name: "Fetch latest phone screenshot",
    command: "codex-project-screenshot-sync fetch-remote --host sbl2 --delete-remote",
    use: "Pulls the latest screenshot from sbl2 into the canonical screenshot path.",
    example: "codex-project-screenshot-sync fetch-remote --host sbl2 --delete-remote",
    state: "guarded",
  },
  {
    group: "screenshots",
    name: "Screenshot service status",
    command: "systemctl --user status codex-project-screenshot-sync.service",
    use: "Checks whether automatic screenshot sync is running.",
    example: "systemctl --user --no-pager status codex-project-screenshot-sync.service",
    state: "safe",
  },
  {
    group: "machine",
    name: "Machine inventory",
    command: "machine-inventory",
    use: "Creates a current machine report for disk, repos, and services.",
    example: "~/antimony-labs-org/bin/machine-inventory",
    state: "safe",
  },
  {
    group: "machine",
    name: "Backup prune dry-run",
    command: "prune-backup-regenerable.sh",
    use: "Checks known regenerable backup paths without deleting anything.",
    example: "~/antimony-labs-org/cleanup/prune-backup-regenerable.sh",
    state: "safe",
  },
  {
    group: "machine",
    name: "Disk pressure",
    command: "df -h /home/curious && du -sh ~/* ~/.[!.]*",
    use: "Quickly finds whether root disk pressure is home data, caches, backups, or projects.",
    example: "df -h /home/curious && du -sh -- ~/* ~/.[!.]* 2>/dev/null | sort -h | tail -40",
    state: "safe",
  },
  {
    group: "remote",
    name: "Keep 4K display mode",
    command: "remote-mode-off",
    use: "Restores the local display mode after remote desktop experiments.",
    example: "remote-mode-off",
    state: "safe",
  },
  {
    group: "remote",
    name: "Tailscale address",
    command: "tailscale ip -4",
    use: "Finds the mesh IP when LAN access is not enough.",
    example: "tailscale ip -4 | head -n 1",
    state: "safe",
  },
];

export const backupSurfaces = [
  {
    name: "migration",
    path: "/home/curious/antimony-labs-org/backups/sbl2-migration",
    size: "82G",
    state: "absorbed",
    detail: "Moved out of home root into Antimony backups. Remaining data still needs semantic review.",
  },
  {
    name: "sbl2 backup",
    path: "/home/curious/antimony-labs-org/backups/sbl2-migration/sbl2-backup-wipe-prep-20260404",
    size: "inside migration",
    state: "absorbed",
    detail: "Main backup source discovered during machine cleanup work.",
  },
  {
    name: "safe reclaim candidate",
    path: "/home/curious/antimony-labs-org/cleanup/prune-backup-regenerable.sh",
    size: "73GiB pruned",
    state: "completed",
    detail: "Applied on 2026-04-23. Follow-up dry-run reports 0B remaining.",
  },
];

export const backupBreakdown = [
  {
    name: "sbl2 wipe-prep backup",
    path: "/home/curious/antimony-labs-org/backups/sbl2-migration/sbl2-backup-wipe-prep-20260404",
    size: "82G",
    signal: "Contains the real backup payload and sensitive config files.",
    action: "Review before any deletion.",
    state: "review",
  },
  {
    name: "sbl1 project copy",
    path: "backup/home/sbl1/projects",
    size: "47G",
    signal: "Likely old project tree. Needs diff against current workspace/private layout.",
    action: "Classify source vs archive.",
    state: "review",
  },
  {
    name: "Windows backup downloads",
    path: "backup/home/sbl1-windows-backup/Downloads",
    size: "12G",
    signal: "Large personal download archive.",
    action: "Review from phone before keeping.",
    state: "review",
  },
  {
    name: "Regenerable caches",
    path: "backup caches: npm, pip, chrome, playwright, rustup",
    size: "73GiB pruned",
    signal: "High-confidence generated/cache content removed from backup.",
    action: "No remaining prune candidates in follow-up dry-run.",
    state: "completed",
  },
];

export const backupPruneCandidates = [
  { path: ".cache", size: "11G" },
  { path: ".npm", size: "5.1G" },
  { path: ".npm-global", size: "2.1G" },
  { path: ".local/whisper-env", size: "7.2G" },
  { path: ".local/share/Steam", size: "2.2G" },
  { path: ".config/google-chrome/OptGuideOnDeviceModel", size: "4.0G" },
  { path: "CounterStrike2", size: "9.3G" },
  { path: "Downloads/ubuntu-24.04.4-desktop-amd64.iso", size: "6.2G" },
  { path: "sbl1/.config/google-chrome/OptGuideOnDeviceModel", size: "4.0G" },
  { path: "sbl1/.local/lib/python3.12/site-packages", size: "8.4G" },
  { path: "sbl1/projects/workspace/blender/build_linux_release", size: "3.3G" },
  { path: "sbl1-windows-backup/Downloads/ubuntu-24.04.3-desktop-amd64.iso", size: "6.0G" },
  { path: "sbl1-windows-backup/Downloads/Win11_25H2_English_x64(1).iso", size: "3.0G" },
  { path: "sbl1-windows-backup/Downloads/blender-with-libraries-5.0.0.tar.xz", size: "1.6G" },
  { path: "sbl1-windows-backup/Downloads/blender-5.0.0-windows-x64.msi", size: "357M" },
];

export const sbl2RetirementFindings = [
  {
    name: "Canonical retirement backup",
    path: "/home/curious/antimony-labs-org/backups/sbl2-migration/sbl2-backup-wipe-prep-20260404/home",
    size: "82G",
    state: "canonical",
    signal: "Superset backup for retiring sbl2. Includes the larger sbl1-rescue and sbl1-windows-backup copies.",
  },
  {
    name: "Redundant archive copy",
    path: "/home/curious/antimony-labs-org/backups/sbl2-archive-reference",
    size: "2.6G",
    state: "semantic review",
    signal: "File comparison says covered, but deletion waits until project-level rebuild classification is complete.",
  },
  {
    name: "Delta preservation",
    path: "/home/curious/antimony-labs-org/backups/sbl2-archive-deltas-20260423",
    size: "420K",
    state: "completed",
    signal: "Preserved the 9 differing files from sbl2_archive before deletion approval.",
  },
  {
    name: "sbl1-rescue",
    path: "canonical: migration backup; duplicate: sbl2_archive/sbl1-rescue",
    size: "3.7G vs 404M",
    state: "canonical",
    signal: "The migration copy is larger and includes the smaller archive copy.",
  },
  {
    name: "sbl1-windows-backup",
    path: "canonical: migration backup; duplicate: sbl2_archive/sbl1-windows-backup",
    size: "6.0G vs 100K",
    state: "canonical",
    signal: "The migration copy contains the useful Windows media/project backup; the sbl2_archive copy is effectively empty.",
  },
];

export const rebuildPrinciples = [
  {
    name: "Project first",
    rule: "A folder is kept, moved, or deleted by what system/project it belongs to, not by filename equality alone.",
    state: "active",
  },
  {
    name: "One canonical home",
    rule: "Every live project gets exactly one canonical path under workspace or antimony-labs-org.",
    state: "active",
  },
  {
    name: "Generated boundary",
    rule: "node_modules, build outputs, caches, toolchains, model caches, and temporary agent workspaces are rebuildable unless they contain source decisions.",
    state: "active",
  },
  {
    name: "Retired machine archive",
    rule: "sbl2 data becomes a source archive until each project is either absorbed into sbl1, marked external, or intentionally discarded.",
    state: "semantic review",
  },
  {
    name: "Secrets manual",
    rule: "SSH keys, OAuth tokens, browser profiles, and credential folders are never merged automatically.",
    state: "protected",
  },
];

export const semanticRebuildBuckets = [
  {
    name: "Open/public projects",
    sources: "/home/curious/workspace plus /home/curious/workspace/vendor",
    target: "/home/curious/workspace",
    state: "absorbed",
    signal: "Public/new batch moved: kaggle, s3m2p, content.too.foo, nasa-trajectory-explorer, vast-model-lab, stretch_isaac_sim. Vendor batch moved: IsaacLab and stable-diffusion-webui.",
  },
  {
    name: "Private Antimony systems",
    sources: "/home/curious/antimony-labs-org/projects/antimony-labs",
    target: "/home/curious/antimony-labs-org/projects",
    state: "absorbed",
    signal: "dashboard, magnetism-mc-api, second-brain, books, codex-screenshot-bridge, and old prompt pack moved into Antimony.",
  },
  {
    name: "Retired sbl2 project archive",
    sources: "/home/curious/antimony-labs-org/backups/sbl2-migration/sbl2-backup-wipe-prep-20260404/home",
    target: "/home/curious/antimony-labs-org/backups/sbl2-retirement",
    state: "semantic review",
    signal: "This is the project source for retiring sbl2 until each project has been absorbed or marked obsolete.",
  },
  {
    name: "Personal records and media",
    sources: "sbl1-rescue, sbl1-windows-backup, Documents, Downloads, Pictures, Videos",
    target: "/home/curious/antimony-labs-org/archive/personal-records",
    state: "protected",
    signal: "Contains identity, employment, legal, finance, screenshots, and video source. Must be curated, not bulk-deleted.",
  },
  {
    name: "Generated environments",
    sources: ".cache, .npm, .cargo, .rustup, go/pkg, node_modules, target, .next, venvs, project-local venvs",
    target: "rebuild from lockfiles or installers",
    state: "rebuildable",
    signal: "These can usually be removed only after source projects and lockfiles are canonical.",
  },
  {
    name: "Tool identity and agents",
    sources: ".codex, .claude, .gemini, .openclaw, .config, .ssh, .gnupg",
    target: "manual migration checklist",
    state: "protected",
    signal: "These affect authentication and agent memory. No automatic merge.",
  },
];

export const semanticRebuildQueue = [
  {
    name: "Freeze deletion",
    decision: "Do not delete sbl2_archive yet.",
    reason: "File coverage is not enough; project absorption must be visible first.",
    state: "active",
  },
  {
    name: "Build project registry",
    decision: "Extend the project registry with canonical workspace paths and remote freshness.",
    reason: "The first public batch is moved; private systems and protected records still need classification.",
    state: "active",
  },
  {
    name: "Absorb active projects",
    decision: "Move only one project at a time after git status and target ownership are known.",
    reason: "Dirty repos and nested repos can be lost if bulk-moved.",
    state: "next",
  },
  {
    name: "Curate personal records",
    decision: "Separate identity/legal/finance docs from generated downloads and media renders.",
    reason: "Personal records have value independent of project source code.",
    state: "protected",
  },
  {
    name: "Then retire duplicates",
    decision: "Delete or compress redundant roots only after the project registry says absorbed/obsolete.",
    reason: "This makes laptop retirement auditable and reversible.",
    state: "blocked",
  },
];

export const homeLayoutTargets = [
  {
    name: "workspace",
    path: "/home/curious/workspace",
    role: "open-source, personal public work, and new experiments",
    state: "created",
  },
  {
    name: "antimony-labs-org",
    path: "/home/curious/antimony-labs-org",
    role: "private/internal Antimony Labs projects, ops, cleanup, deployment notes",
    state: "exists",
  },
  {
    name: "home root",
    path: "/home/curious",
    role: "only dotfiles, standard user folders, bin, workspace, antimony-labs-org",
    state: "clean",
  },
];

export const homeCleanupQueue = [
  {
    name: "kaggle",
    currentPath: "/home/curious/workspace/kaggle",
    targetPath: "/home/curious/workspace/kaggle",
    size: "62G",
    state: "absorbed",
    rule: "Moved from home root. Fetched cleanly; not behind origin/main; dirty working tree preserved.",
  },
  {
    name: "s3m2p",
    currentPath: "/home/curious/workspace/s3m2p",
    targetPath: "/home/curious/workspace/s3m2p",
    size: "31G",
    state: "absorbed",
    rule: "Moved from home root. Fetched cleanly; not behind origin/main; dirty working tree preserved.",
  },
  {
    name: "content.too.foo",
    currentPath: "/home/curious/workspace/content.too.foo",
    targetPath: "/home/curious/workspace/content.too.foo",
    size: "2.3G",
    state: "absorbed",
    rule: "Moved from home root. Fetch is blocked by GitHub 403 with current credentials; dirty working tree preserved.",
  },
  {
    name: "nasa-trajectory-explorer",
    currentPath: "/home/curious/workspace/nasa-trajectory-explorer",
    targetPath: "/home/curious/workspace/nasa-trajectory-explorer",
    size: "18M",
    state: "absorbed",
    rule: "Moved from home root. Local git repo has no upstream configured; dirty working tree preserved.",
  },
  {
    name: "vast-model-lab",
    currentPath: "/home/curious/workspace/vast-model-lab",
    targetPath: "/home/curious/workspace/vast-model-lab",
    size: "432K",
    state: "absorbed",
    rule: "Moved from home root. Local Python project with uv lock and state files; no git remote yet.",
  },
  {
    name: "stretch_isaac_sim",
    currentPath: "/home/curious/workspace/stretch_isaac_sim",
    targetPath: "/home/curious/workspace/stretch_isaac_sim",
    size: "505M",
    state: "absorbed",
    rule: "Moved from home root. Simulation assets and local venv preserved; source/generated boundary still needs cleanup.",
  },
  {
    name: "IsaacLab",
    currentPath: "/home/curious/workspace/vendor/IsaacLab",
    targetPath: "/home/curious/workspace/vendor/IsaacLab",
    size: "92M",
    state: "absorbed",
    rule: "Moved from home root into vendor. Fetched cleanly; not behind origin/main.",
  },
  {
    name: "stable-diffusion-webui",
    currentPath: "/home/curious/workspace/vendor/stable-diffusion-webui",
    targetPath: "/home/curious/workspace/vendor/stable-diffusion-webui",
    size: "5.1G",
    state: "absorbed",
    rule: "Moved from home root into vendor. Fetched cleanly; not behind origin/master; one local change preserved.",
  },
  {
    name: "dev projects",
    currentPath: "/home/curious/antimony-labs-org/projects/antimony-labs",
    targetPath: "/home/curious/antimony-labs-org/projects/antimony-labs",
    size: "2.1G",
    state: "absorbed",
    rule: "Moved from home root. magnetism-mc-api, second-brain, nested books, screenshot bridge, and archived prompts preserved.",
  },
  {
    name: "dashboard",
    currentPath: "/home/curious/antimony-labs-org/projects/antimony-labs/dashboard",
    targetPath: "/home/curious/antimony-labs-org/projects/antimony-labs/dashboard",
    size: "632M",
    state: "absorbed",
    rule: "Moved from work/antimony. LAN systemd service now runs from the canonical Antimony path.",
  },
  {
    name: "migration",
    currentPath: "/home/curious/antimony-labs-org/backups/sbl2-migration",
    targetPath: "/home/curious/antimony-labs-org/backups/sbl2-migration",
    size: "82G",
    state: "absorbed",
    rule: "Moved from home root. Cache pruning is complete; remaining backup needs source/archive classification.",
  },
  {
    name: "sbl2_archive",
    currentPath: "/home/curious/antimony-labs-org/backups/sbl2-archive-reference",
    targetPath: "/home/curious/antimony-labs-org/backups/sbl2-archive-reference",
    size: "2.6G",
    state: "absorbed",
    rule: "Moved from home root. Kept as semantic reference archive until project-level absorption is complete.",
  },
  {
    name: "home loose files",
    currentPath: "/home/curious/antimony-labs-org/archive/home-root-loose",
    targetPath: "/home/curious/antimony-labs-org/archive/home-root-loose",
    size: "28K",
    state: "absorbed",
    rule: "Moved loose root files out of the visible home surface. No data deleted.",
  },
  {
    name: "root installer cache",
    currentPath: "/home/curious/antimony-labs-org/archive/installers",
    targetPath: "/home/curious/antimony-labs-org/archive/installers",
    size: "56M",
    state: "absorbed",
    rule: "Moved the Google Earth deb installer out of home root. Candidate for deletion after app reinstall path is confirmed.",
  },
  {
    name: "root node_modules",
    currentPath: "/home/curious/antimony-labs-org/archive/root-node_modules/node_modules",
    targetPath: "/home/curious/antimony-labs-org/archive/root-node_modules/node_modules",
    size: "716K",
    state: "absorbed",
    rule: "Moved accidental home-root dependency folder into archive. Candidate for deletion after no script references it.",
  },
  {
    name: "sbl0-vault",
    currentPath: "/home/curious/antimony-labs-org/projects/archive/sbl0-vault",
    targetPath: "/home/curious/antimony-labs-org/projects/archive/sbl0-vault",
    size: "212K",
    state: "absorbed",
    rule: "Replaced archive symlink with the real project directory. Root project copy removed by move, not deletion.",
  },
  {
    name: "shared content",
    currentPath: "/home/curious/workspace/shared/content-too-foo",
    targetPath: "/home/curious/workspace/shared/content-too-foo",
    size: "1.8M",
    state: "absorbed",
    rule: "Moved shared public content into workspace/shared.",
  },
  {
    name: "root venvs",
    currentPath: "/home/curious/antimony-labs-org/runtime/venvs",
    targetPath: "/home/curious/antimony-labs-org/runtime/venvs",
    size: "435M",
    state: "absorbed",
    rule: "Moved root Python virtual environments into Antimony runtime holding area for later project ownership review.",
  },
  {
    name: "go module cache",
    currentPath: "/home/curious/antimony-labs-org/runtime/go-module-cache",
    targetPath: "/home/curious/antimony-labs-org/runtime/go-module-cache",
    size: "906M",
    state: "absorbed",
    rule: "Moved Go module cache out of visible root. Go may recreate ~/go later unless GOPATH/GOMODCACHE is formalized.",
  },
  {
    name: "snap",
    currentPath: "/home/curious/snap",
    targetPath: "/home/curious/snap",
    size: "1.4G",
    state: "protected",
    rule: "Left in place because Snap apps expect this user-data directory. Remove only by uninstalling or migrating Snap apps deliberately.",
  },
];

export const projectPortfolio = [
  {
    name: "dashboard",
    role: "phone-first operator dashboard",
    localPath: "/home/curious/antimony-labs-org/projects/antimony-labs/dashboard",
    github: "antimony-labs/dashboard",
    githubState: "public",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-03-14",
    lastGithubPush: "2026-03-15",
    size: "635M",
    dirtyCount: 9,
    note: "Moved into antimony-labs-org. Current dashboard work is uncommitted locally.",
  },
  {
    name: "core",
    role: "future platform API / gateway",
    localPath: "not cloned on sbl1",
    github: "antimony-labs/core",
    githubState: "public",
    localState: "remote only",
    syncState: "github only",
    lastLocalUpdate: "n/a",
    lastGithubPush: "2026-03-15",
    size: "42 KB repo",
    dirtyCount: 0,
    note: "Visible on GitHub, but no local checkout found in the active workspace.",
  },
  {
    name: "fleet",
    role: "fleet telemetry / machine signals",
    localPath: "not cloned on sbl1",
    github: "antimony-labs/fleet",
    githubState: "public",
    localState: "remote only",
    syncState: "github only",
    lastLocalUpdate: "n/a",
    lastGithubPush: "2026-03-15",
    size: "28 KB repo",
    dirtyCount: 0,
    note: "Visible on GitHub, but no local checkout found in the active workspace.",
  },
  {
    name: "e51",
    role: "Element 51 public product surface",
    localPath: "not cloned on sbl1",
    github: "antimony-labs/e51",
    githubState: "public",
    localState: "remote only",
    syncState: "github only",
    lastLocalUpdate: "n/a",
    lastGithubPush: "2026-03-15",
    size: "173 KB repo",
    dirtyCount: 0,
    note: "Public GitHub repo exists; local source has not been consolidated here yet.",
  },
  {
    name: "magnetism-mc-api",
    role: "local API and screenshot workflow",
    localPath: "/home/curious/antimony-labs-org/projects/antimony-labs/magnetism-mc-api",
    github: "antimony-labs/magnetism-mc-api",
    githubState: "unresolved",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-03-13",
    lastGithubPush: "unknown",
    size: "151M",
    dirtyCount: 38,
    note: "Moved into antimony-labs-org. Local remote exists, but GitHub could not resolve this repo with current access.",
  },
  {
    name: "second-brain",
    role: "PWA / knowledge system",
    localPath: "/home/curious/antimony-labs-org/projects/antimony-labs/second-brain",
    github: "antimony-labs/second-brain",
    githubState: "unresolved",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-02-21",
    lastGithubPush: "unknown",
    size: "1.9G",
    dirtyCount: 3,
    note: "Moved into antimony-labs-org. Parent repo has untracked imported sbl2 directories.",
  },
  {
    name: "books",
    role: "AI novel / book engine",
    localPath: "/home/curious/antimony-labs-org/projects/antimony-labs/second-brain/sbl2_books",
    github: "antimony-labs/books",
    githubState: "token restricted",
    localState: "dirty",
    syncState: "ahead 8",
    lastLocalUpdate: "2026-04-20",
    lastGithubPush: "restricted",
    size: "inside second-brain",
    dirtyCount: 6,
    note: "Local branch is ahead by 8 commits; this should be resolved before consolidation.",
  },
  {
    name: "s3m2p",
    role: "public portfolio / app hub source",
    localPath: "/home/curious/workspace/s3m2p",
    github: "Shivam-Bhardwaj/s3m2p",
    githubState: "fetched",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-04-04",
    lastGithubPush: "not behind origin/main",
    size: "31G",
    dirtyCount: 20,
    note: "Moved into workspace. Large local working tree with active app/content changes.",
  },
  {
    name: "content.too.foo",
    role: "content generation and rendering",
    localPath: "/home/curious/workspace/content.too.foo",
    github: "Shivam-Bhardwaj/content.too.foo",
    githubState: "fetch blocked",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-02-03",
    lastGithubPush: "403 on fetch",
    size: "2.3G",
    dirtyCount: 9,
    note: "Moved into workspace. Contains generated assets and render workflows.",
  },
  {
    name: "kaggle",
    role: "Kaggle experiments and competition workflows",
    localPath: "/home/curious/workspace/kaggle",
    github: "Shivam-Bhardwaj/kaggle",
    githubState: "fetched",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2026-03-08",
    lastGithubPush: "not behind origin/main",
    size: "62G",
    dirtyCount: 26,
    note: "Moved into workspace. Largest project workspace after backups; many untracked competitions.",
  },
  {
    name: "nasa-trajectory-explorer",
    role: "Rust trajectory explorer",
    localPath: "/home/curious/workspace/nasa-trajectory-explorer",
    github: "no upstream configured",
    githubState: "local only",
    localState: "dirty",
    syncState: "no upstream",
    lastLocalUpdate: "2026-04-23",
    lastGithubPush: "n/a",
    size: "18M",
    dirtyCount: 8,
    note: "Moved into workspace. Needs remote classification before publishing or archiving.",
  },
  {
    name: "vast-model-lab",
    role: "model evaluation lab",
    localPath: "/home/curious/workspace/vast-model-lab",
    github: "no upstream configured",
    githubState: "local only",
    localState: "local",
    syncState: "no upstream",
    lastLocalUpdate: "2026-04-23",
    lastGithubPush: "n/a",
    size: "432K",
    dirtyCount: 0,
    note: "Moved into workspace. Python project with uv lock and local run state.",
  },
  {
    name: "stretch_isaac_sim",
    role: "Stretch robot Isaac simulation assets",
    localPath: "/home/curious/workspace/stretch_isaac_sim",
    github: "no upstream configured",
    githubState: "local only",
    localState: "local",
    syncState: "no upstream",
    lastLocalUpdate: "2026-04-23",
    lastGithubPush: "n/a",
    size: "505M",
    dirtyCount: 0,
    note: "Moved into workspace. Contains source scripts, robot meshes, USD/URDF assets, and a local venv.",
  },
  {
    name: "IsaacLab",
    role: "third-party robotics learning/research framework",
    localPath: "/home/curious/workspace/vendor/IsaacLab",
    github: "isaac-sim/IsaacLab",
    githubState: "fetched",
    localState: "clean",
    syncState: "synced",
    lastLocalUpdate: "2026-04-08",
    lastGithubPush: "not behind origin/main",
    size: "92M",
    dirtyCount: 0,
    note: "Moved into workspace/vendor. Third-party checkout is current with upstream.",
  },
  {
    name: "stable-diffusion-webui",
    role: "third-party image generation tool",
    localPath: "/home/curious/workspace/vendor/stable-diffusion-webui",
    github: "AUTOMATIC1111/stable-diffusion-webui",
    githubState: "fetched",
    localState: "dirty",
    syncState: "synced",
    lastLocalUpdate: "2024-07-27",
    lastGithubPush: "not behind origin/master",
    size: "5.1G",
    dirtyCount: 1,
    note: "Moved into workspace/vendor. One local change is preserved.",
  },
];

export const developmentDna = [
  {
    name: "Umbrella ownership",
    rule: "antimony-labs is the canonical umbrella for platform, dashboard, infra, AI systems, and deployment work.",
    phonePrompt: "Does this belong under antimony-labs?",
    state: "active",
  },
  {
    name: "Open-source outlet",
    rule: "personal GitHub is for public open-source projects, portfolio surfaces, and projects that intentionally represent Shivam directly.",
    phonePrompt: "Is this meant to be open-source or personally branded?",
    state: "active",
  },
  {
    name: "No Markdown as interface",
    rule: "Markdown can exist only when external tools require it. Human-facing operating knowledge must be structured data rendered in the dashboard.",
    phonePrompt: "Should this become data instead of a doc?",
    state: "active",
  },
  {
    name: "LLM-readable state",
    rule: "Facts should live in small typed records with stable fields, dates, owners, states, and decisions so LLMs can diff and reason quickly.",
    phonePrompt: "Can an LLM update this safely without reading prose?",
    state: "active",
  },
  {
    name: "Phone comment loop",
    rule: "The phone is the review surface. Each object should support short comments, decisions, and state changes without terminal context.",
    phonePrompt: "What is the smallest comment needed to move this forward?",
    state: "designing",
  },
  {
    name: "Generated content boundary",
    rule: "Generated artifacts, cache, notebooks, renders, and screenshots must be separated from source decisions and clearly marked.",
    phonePrompt: "Is this source, generated, cache, or archive?",
    state: "designing",
  },
];

export const nextActions = [
  "Use secret-store for every new project secret, then rebuild dashboard state",
  "Define LLM development DNA in dashboard data, not Markdown",
  "Keep dashboard phone-first: no fake nav, no home-screen reports",
  "Create a project consolidation policy before moving files",
  "Review backups before deleting anything",
  "Resolve GitHub access gaps for private/personal repositories",
  "Restore sbl4 SSH / Tailscale reachability",
  "Commit or intentionally shelve dirty working trees",
];

export const interactionPrinciples = [
  {
    name: "One screen first",
    detail: "The phone home screen is a launcher, not a report.",
  },
  {
    name: "Reveal on intent",
    detail: "Details open only after a tap, then disappear cleanly.",
  },
  {
    name: "No terminal thinking",
    detail: "Operational state should become dashboard data, not prose files.",
  },
  {
    name: "Small surfaces",
    detail: "Each panel owns one job so future development stays simple.",
  },
];

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import ApiStatus from "@/components/ApiStatus";
import FleetStatus from "@/components/FleetStatus";
import {
  backupBreakdown,
  backupPruneCandidates,
  backupSurfaces,
  dashboardAccessModes,
  developmentDna,
  domainSurfaces,
  homeCleanupQueue,
  homeLayoutTargets,
  llmCheckPrinciples,
  llmChecks,
  machineFacts,
  nextActions,
  operatingNodes,
  projectDecisionLanes,
  projectPortfolio,
  projectMantras,
  projectOperatingPrinciples,
  projectPrograms,
  projectReminders,
  rebuildPrinciples,
  semanticRebuildBuckets,
  semanticRebuildQueue,
  sbl2RetirementFindings,
  secretInventory,
  secretPolicy,
  shortcutInventory,
  shortcutPrinciples,
} from "@/data/platform";

type PanelId =
  | "dna"
  | "mantras"
  | "projects"
  | "infra"
  | "telemetry"
  | "openclaw"
  | "domains"
  | "nodes"
  | "secrets"
  | "shortcuts"
  | "backups"
  | "actions";

function OpenClawChatPanel() {
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [messages, setMessages] = useState([
    {
      role: "openclaw",
      text: "Dashboard chat surface is ready. The live OpenClaw bridge still needs an authenticated endpoint before messages leave this page.",
    },
  ]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const attachmentNote = attachments.length
      ? ` Attachments staged: ${attachments.join(", ")}.`
      : "";

    setMessages((current) => [
      ...current,
      { role: "you", text: `${text}${attachmentNote}` },
      {
        role: "openclaw",
        text: "Message staged locally. Next implementation step: connect this form to the OpenClaw dashboard gateway with auth and audit logging.",
      },
    ]);
    setDraft("");
    setAttachments([]);
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAttachments(
      Array.from(event.target.files ?? []).map((file) => {
        const sizeKb = Math.max(1, Math.round(file.size / 1024));
        return `${file.name} ${sizeKb}KB`;
      }),
    );
  };

  return (
    <div className="panel-stack openclaw-panel">
      <div className="secret-summary openclaw-summary">
        <div>
          <span className="summary-label">Agent conversation layer</span>
          <strong>OpenClaw belongs inside the dashboard</strong>
          <span>Chat is present now; live routing waits for the authenticated OpenClaw bridge.</span>
        </div>
        <div className="secret-summary-counts">
          <span className="state-pill staged">ui ready</span>
          <span className="state-pill next">bridge next</span>
        </div>
      </div>

      <div className="openclaw-chat-shell">
        <div className="openclaw-transcript" aria-live="polite">
          {messages.map((message, index) => (
            <article className={`openclaw-message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role}</span>
              <p>{message.text}</p>
            </article>
          ))}
        </div>

        <form className="openclaw-compose" onSubmit={handleSubmit}>
          <label htmlFor="openclaw-message">Message OpenClaw</label>
          <textarea
            id="openclaw-message"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask OpenClaw what to do next, or stage a command for the bridge."
            rows={4}
            value={draft}
          />
          <div className="openclaw-upload-zone">
            <label htmlFor="openclaw-attachments">Attach images / files</label>
            <input
              id="openclaw-attachments"
              multiple
              onChange={handleAttachmentChange}
              type="file"
            />
            {attachments.length ? (
              <div className="openclaw-attachment-list">
                {attachments.map((attachment) => (
                  <span key={attachment}>{attachment}</span>
                ))}
              </div>
            ) : (
              <span>Local attachment staging only until the Cloudflare tunnel + gateway are connected.</span>
            )}
          </div>
          <div className="openclaw-compose-actions">
            <span>Local staging only until the OpenClaw gateway is wired.</span>
            <button type="submit">Stage</button>
          </div>
        </form>
      </div>

      <div className="openclaw-bridge-grid">
        <article>
          <strong>Cloudflare tunnel</strong>
          <span>Expose the OpenClaw gateway through Cloudflare Access, not raw port forwarding.</span>
        </article>
        <article>
          <strong>Multimodal context</strong>
          <span>Images and files should become first-class context for agent work.</span>
        </article>
        <article>
          <strong>Execution safety</strong>
          <span>Commands need confirmation, audit trail, and vault-backed secrets.</span>
        </article>
      </div>
    </div>
  );
}

function PanelTitle({ panel }: { panel: PanelId }) {
  const title = {
    dna: "LLM Mantra",
    mantras: "My Mantra",
    projects: "Project Management",
    infra: "Infrastructure",
    telemetry: "Telemetry",
    openclaw: "OpenClaw Chat",
    domains: "Domain Map",
    nodes: "Machine State",
    secrets: "Secret Registry",
    shortcuts: "Shortcuts",
    backups: "Machine Rebuild",
    actions: "Next Actions",
  }[panel];

  return (
    <div>
      <span className="kicker">Focused panel</span>
      <h3>{title}</h3>
    </div>
  );
}

function PanelBody({ panel }: { panel: PanelId }) {
  const getProjectZone = (path: string) => {
    if (path.startsWith("/home/curious/antimony-labs-org")) return "antimony";
    if (path.startsWith("/home/curious/workspace/vendor")) return "vendor";
    if (path.startsWith("/home/curious/workspace")) return "workspace";
    if (path.startsWith("not cloned")) return "remote";
    return "local";
  };

  if (panel === "dna") {
    const groupedChecks = llmChecks.reduce<
      Array<{ group: string; checks: typeof llmChecks }>
    >((groups, check) => {
      const group = groups.find((item) => item.group === check.group);
      if (group) {
        group.checks.push(check);
      } else {
        groups.push({ group: check.group, checks: [check] });
      }
      return groups;
    }, []);

    const protectedCount = llmChecks.filter((check) => check.state === "protected").length;

    return (
      <div className="panel-stack check-panel">
        <div className="secret-summary check-summary">
          <div>
            <span className="summary-label">LLM operating contract</span>
            <strong>{llmChecks.length} checks</strong>
            <span>Compact rules for edits, safety, mobile UI, deployment, and communication.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill protected">{protectedCount} protected</span>
          </div>
        </div>

        <div className="check-principles">
          {llmCheckPrinciples.map((item) => (
            <article className="check-principle-card" key={item.name}>
              <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>{item.state}</span>
              <strong>{item.name}</strong>
              <span>{item.rule}</span>
            </article>
          ))}
        </div>

        <div className="check-groups">
          {groupedChecks.map((group) => (
            <section className="check-group" key={group.group}>
              <div className="secret-group-heading">
                <strong>{group.group}</strong>
                <span>{group.checks.length}</span>
              </div>
              <div className="check-rows">
                {group.checks.map((check) => (
                  <article className="check-row" key={`${check.group}-${check.name}`}>
                    <div className="check-name-block">
                      <strong>{check.name}</strong>
                      <span>{check.check}</span>
                    </div>
                    <span className={`state-pill ${check.state.replaceAll(" ", "-")}`}>
                      {check.state}
                    </span>
                    <span className="check-why">{check.why}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="dna-strip">
          {developmentDna.map((item) => (
            <article className="dna-pill" key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.phonePrompt}</span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "mantras") {
    return (
      <div className="panel-stack mantra-panel">
        <div className="secret-summary mantra-summary">
          <div>
            <span className="summary-label">Decision layer</span>
            <strong>{projectMantras.length} priorities</strong>
            <span>Use these to choose design direction, agent behavior, and what belongs in the system.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill protected">security</span>
          </div>
        </div>

        <div className="mantra-board">
          {projectMantras.map((item) => (
            <article className="mantra-card" key={item.name}>
              <div className="mantra-card-top">
                <span className="mantra-rank">{item.priority}</span>
                <span className="summary-label">{item.group}</span>
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
              </div>
              <strong>{item.name}</strong>
              <p>{item.mantra}</p>
              <span className="mantra-prompt">{item.prompt}</span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "projects") {
    const projectsByName = new Map(projectPortfolio.map((project) => [project.name, project]));
    const dirtyProjectCount = projectPortfolio.filter((project) => project.dirtyCount > 0).length;
    const decisionProjectCount = new Set(projectDecisionLanes.flatMap((lane) => lane.projects)).size;

    return (
      <div className="panel-stack project-hub">
        <div className="secret-summary project-summary">
          <div>
            <span className="summary-label">Program lens</span>
            <strong>Build the system that builds the system</strong>
            <span>Use this panel to choose outcomes, sequence work, and turn repo chaos into decisions.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill active">{decisionProjectCount} in view</span>
            <span className="state-pill review">{dirtyProjectCount} dirty</span>
          </div>
        </div>

        <div className="project-principles">
          {projectOperatingPrinciples.map((principle) => (
            <article className="project-principle-card" key={principle.name}>
              <span className={`state-pill ${principle.state.replaceAll(" ", "-")}`}>
                {principle.state}
              </span>
              <strong>{principle.name}</strong>
              <span>{principle.rule}</span>
            </article>
          ))}
        </div>

        <div className="project-program-board">
          {projectPrograms.map((program) => (
            <article className="project-program-card" key={program.name}>
              <div className="project-program-top">
                <span className={`state-pill ${program.state.replaceAll(" ", "-")}`}>
                  {program.state}
                </span>
                <span>{program.projects.length} projects</span>
              </div>
              <strong>{program.name}</strong>
              <p>{program.outcome}</p>
              <dl className="project-program-fields">
                <div>
                  <dt>current bet</dt>
                  <dd>{program.currentBet}</dd>
                </div>
                <div>
                  <dt>next decision</dt>
                  <dd>{program.nextDecision}</dd>
                </div>
                <div>
                  <dt>risk</dt>
                  <dd>{program.risk}</dd>
                </div>
              </dl>
              <div className="project-chip-row">
                {program.projects.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="project-decision-board">
          {projectDecisionLanes.map((lane) => (
            <section className="project-decision-lane" key={lane.name}>
              <div className="project-decision-heading">
                <div>
                  <span className="summary-label">{lane.intent}</span>
                  <strong>{lane.name}</strong>
                  <p>{lane.ask}</p>
                </div>
                <span className={`state-pill ${lane.state.replaceAll(" ", "-")}`}>
                  {lane.state}
                </span>
              </div>

              <div className="project-decision-list">
                {lane.projects.map((name) => {
                  const project = projectsByName.get(name);

                  if (!project) return null;

                  const reminder = projectReminders[project.name]?.[0] ?? project.note;

                  return (
                    <article className="project-decision-row" key={project.name}>
                      <div className="project-decision-main">
                        <strong>{project.name}</strong>
                        <span>{project.role}</span>
                      </div>
                      <div className="project-decision-meta">
                        <span className="project-zone">{getProjectZone(project.localPath)}</span>
                        <span className={`state-pill ${project.localState.replaceAll(" ", "-")}`}>
                          {project.localState}
                        </span>
                      </div>
                      <div className="project-decision-facts">
                        <span>
                          <strong>{project.lastLocalUpdate}</strong>
                          updated
                        </span>
                        <span>
                          <strong>{project.dirtyCount}</strong>
                          dirty
                        </span>
                        <span>
                          <strong>{project.size}</strong>
                          size
                        </span>
                      </div>
                      <p>{reminder}</p>
                      <span className="project-decision-path">{project.localPath}</span>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "infra") {
    const vaultCount = secretInventory.filter((secret) => secret.state === "vault").length;
    const missingCount = secretInventory.filter((secret) => secret.state === "missing").length;
    const safeCount = shortcutInventory.filter((shortcut) => shortcut.state === "safe").length;
    const guardedCount = shortcutInventory.filter((shortcut) => shortcut.state === "guarded").length;

    return (
      <div className="panel-stack infra-panel">
        <div className="secret-summary infra-summary">
          <div>
            <span className="summary-label">Infrastructure surface</span>
            <strong>Machine, domains, secrets, shortcuts, access</strong>
            <span>Operational things live here so the launcher stays small and project work stays focused.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill next">remote auth</span>
            <span className="state-pill protected">vault</span>
          </div>
        </div>

        <div className="infra-grid">
          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>access</strong>
              <span>{dashboardAccessModes.length}</span>
            </div>
            <div className="infra-rows">
              {dashboardAccessModes.map((mode) => (
                <article className="infra-row" key={mode.name}>
                  <div>
                    <strong>{mode.name}</strong>
                    <span>{mode.endpoint}</span>
                    <p>{mode.use}</p>
                  </div>
                  <span className={`state-pill ${mode.state.replaceAll(" ", "-")}`}>
                    {mode.state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>machine</strong>
              <span>{machineFacts.length}</span>
            </div>
            <div className="infra-rows">
              {machineFacts.map((fact) => (
                <article className="infra-row" key={fact.label}>
                  <div>
                    <strong>{fact.label}</strong>
                    <span>{fact.value}</span>
                    <p>{fact.detail}</p>
                  </div>
                  <span className={`state-pill ${fact.state}`}>{fact.state}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>domains</strong>
              <span>{domainSurfaces.length}</span>
            </div>
            <div className="infra-rows">
              {domainSurfaces.map((surface) => (
                <article className="infra-row" key={surface.domain}>
                  <div>
                    <strong>{surface.domain}</strong>
                    <span>{surface.role}</span>
                    <p>{surface.audience}</p>
                  </div>
                  <span className={`state-pill ${surface.state.replaceAll(" ", "-")}`}>
                    {surface.state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>secrets</strong>
              <span>{secretInventory.length}</span>
            </div>
            <div className="infra-metric-row">
              <span className="state-pill vault">{vaultCount} vault</span>
              <span className="state-pill missing">{missingCount} missing</span>
              <span className="state-pill protected">values hidden</span>
            </div>
            <div className="infra-rows compact">
              {secretPolicy.map((item) => (
                <article className="infra-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.rule}</span>
                  </div>
                  <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>shortcuts</strong>
              <span>{shortcutInventory.length}</span>
            </div>
            <div className="infra-metric-row">
              <span className="state-pill safe">{safeCount} safe</span>
              <span className="state-pill guarded">{guardedCount} guarded</span>
            </div>
            <div className="infra-rows compact">
              {shortcutPrinciples.map((item) => (
                <article className="infra-row" key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.rule}</span>
                  </div>
                  <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                    {item.state}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="infra-card">
            <div className="secret-group-heading">
              <strong>nodes</strong>
              <span>{operatingNodes.length}</span>
            </div>
            <div className="infra-rows">
              {operatingNodes.map((node) => (
                <article className="infra-row" key={node.id}>
                  <div>
                    <strong>{node.id}</strong>
                    <span>{node.role}</span>
                    <p>{node.signal}</p>
                  </div>
                  <span className={`state-pill ${node.state}`}>{node.state}</span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (panel === "telemetry") {
    return (
      <div className="panel-stack telemetry-panel">
        <div className="secret-summary telemetry-summary">
          <div>
            <span className="summary-label">Life management signals</span>
            <strong>Fleet health and machine pressure</strong>
            <span>Telemetry should become the always-available evidence layer for decisions.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill live">fleet</span>
            <span className="state-pill review">api dependent</span>
          </div>
        </div>
        <FleetStatus />
      </div>
    );
  }

  if (panel === "openclaw") {
    return <OpenClawChatPanel />;
  }

  if (panel === "domains") {
    return (
      <div className="domain-list">
        {domainSurfaces.map((surface) => (
          <a
            className="domain-row"
            href={`https://${surface.domain}`}
            key={surface.domain}
            rel="noreferrer"
            target="_blank"
          >
            <div>
              <strong>{surface.domain}</strong>
              <span>{surface.role}</span>
            </div>
            <div className="domain-meta">
              <span className={`state-pill ${surface.state.replaceAll(" ", "-")}`}>
                {surface.state}
              </span>
              <span>{surface.audience}</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  if (panel === "nodes") {
    return (
      <div className="panel-stack">
        <div className="fact-grid">
          {machineFacts.map((fact) => (
            <div className="fact-card" key={fact.label}>
              <span className="summary-label">{fact.label}</span>
              <strong>{fact.value}</strong>
              <span>{fact.detail}</span>
              <span className={`state-pill ${fact.state}`}>{fact.state}</span>
            </div>
          ))}
        </div>

        <div className="node-list">
          {operatingNodes.map((node) => (
            <div className="ops-node" key={node.id}>
              <div>
                <strong>{node.id}</strong>
                <span>{node.role}</span>
              </div>
              <div>
                <span className={`state-pill ${node.state}`}>{node.state}</span>
                <span className="node-signal">{node.signal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "secrets") {
    const groupedSecrets = secretInventory.reduce<
      Array<{ scope: string; secrets: typeof secretInventory }>
    >((groups, secret) => {
      const group = groups.find((item) => item.scope === secret.scope);
      if (group) {
        group.secrets.push(secret);
      } else {
        groups.push({ scope: secret.scope, secrets: [secret] });
      }
      return groups;
    }, []);

    const vaultCount = secretInventory.filter((secret) => secret.state === "vault").length;
    const missingCount = secretInventory.filter((secret) => secret.state === "missing").length;
    const localCount = secretInventory.filter((secret) => secret.state === "local-app-auth").length;

    return (
      <div className="panel-stack secret-panel">
        <div className="secret-summary">
          <div>
            <span className="summary-label">Visible metadata</span>
            <strong>{secretInventory.length} secret records</strong>
            <span>Names, usage, source, and freshness only. Values are never rendered.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill vault">{vaultCount} vault</span>
            <span className="state-pill missing">{missingCount} missing</span>
            <span className="state-pill local-app-auth">{localCount} app auth</span>
          </div>
        </div>

        <div className="secret-policy-strip">
          {secretPolicy.map((item) => (
            <article className="secret-policy-card" key={item.name}>
              <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>{item.state}</span>
              <strong>{item.name}</strong>
              <span>{item.rule}</span>
            </article>
          ))}
        </div>

        <div className="secret-groups">
          {groupedSecrets.map((group) => (
            <section className="secret-group" key={group.scope}>
              <div className="secret-group-heading">
                <strong>{group.scope}</strong>
                <span>{group.secrets.length}</span>
              </div>
              <div className="secret-rows">
                {group.secrets.map((secret) => (
                  <article className="secret-row" key={`${secret.scope}-${secret.name}`}>
                    <div className="secret-name-block">
                      <strong>{secret.name}</strong>
                      <span>{secret.consumer}</span>
                    </div>
                    <span className={`state-pill ${secret.state.replaceAll(" ", "-")}`}>
                      {secret.source}
                    </span>
                    <span className="secret-local">{secret.localStatus}</span>
                    <span className="secret-date">{secret.lastUpdated}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "shortcuts") {
    const groupedShortcuts = shortcutInventory.reduce<
      Array<{ group: string; shortcuts: typeof shortcutInventory }>
    >((groups, shortcut) => {
      const group = groups.find((item) => item.group === shortcut.group);
      if (group) {
        group.shortcuts.push(shortcut);
      } else {
        groups.push({ group: shortcut.group, shortcuts: [shortcut] });
      }
      return groups;
    }, []);

    const safeCount = shortcutInventory.filter((shortcut) => shortcut.state === "safe").length;
    const guardedCount = shortcutInventory.filter((shortcut) => shortcut.state === "guarded").length;

    return (
      <div className="panel-stack shortcut-panel">
        <div className="secret-summary shortcut-summary">
          <div>
            <span className="summary-label">Command memory</span>
            <strong>{shortcutInventory.length} shortcuts</strong>
            <span>Useful commands with purpose, example, and safety. The dashboard does not execute them.</span>
          </div>
          <div className="secret-summary-counts">
            <span className="state-pill safe">{safeCount} safe</span>
            <span className="state-pill guarded">{guardedCount} guarded</span>
          </div>
        </div>

        <div className="shortcut-principles">
          {shortcutPrinciples.map((item) => (
            <article className="shortcut-principle-card" key={item.name}>
              <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>{item.state}</span>
              <strong>{item.name}</strong>
              <span>{item.rule}</span>
            </article>
          ))}
        </div>

        <div className="shortcut-groups">
          {groupedShortcuts.map((group) => (
            <section className="shortcut-group" key={group.group}>
              <div className="secret-group-heading">
                <strong>{group.group}</strong>
                <span>{group.shortcuts.length}</span>
              </div>
              <div className="shortcut-rows">
                {group.shortcuts.map((shortcut) => (
                  <article className="shortcut-row" key={`${shortcut.group}-${shortcut.name}`}>
                    <div className="shortcut-row-main">
                      <div>
                        <strong>{shortcut.name}</strong>
                        <span>{shortcut.use}</span>
                      </div>
                      <span className={`state-pill ${shortcut.state}`}>{shortcut.state}</span>
                    </div>
                    <code>{shortcut.command}</code>
                    <span className="shortcut-example">{shortcut.example}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "backups") {
    return (
      <div className="panel-stack">
        <div className="layout-target-grid">
          {homeLayoutTargets.map((target) => (
            <article className="layout-target-card" key={target.name}>
              <span className="summary-label">{target.name}</span>
              <strong>{target.path}</strong>
              <span>{target.role}</span>
              <span className={`state-pill ${target.state.replaceAll(" ", "-")}`}>
                {target.state}
              </span>
            </article>
          ))}
        </div>

        <div className="backup-breakdown-grid">
          {rebuildPrinciples.map((item) => (
            <article className="backup-breakdown-card" key={item.name}>
              <div>
                <span className="summary-label">{item.name}</span>
                <strong>{item.state}</strong>
              </div>
              <p>{item.rule}</p>
              <div>
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="backup-breakdown-grid">
          {semanticRebuildBuckets.map((item) => (
            <article className="backup-breakdown-card" key={item.name}>
              <div>
                <span className="summary-label">{item.name}</span>
                <strong>{item.target}</strong>
                <span>{item.sources}</span>
              </div>
              <p>{item.signal}</p>
              <div>
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="cleanup-queue">
          {semanticRebuildQueue.map((item) => (
            <article className="cleanup-card" key={item.name}>
              <div className="cleanup-card-main">
                <span className="summary-label">{item.name}</span>
                <strong>{item.decision}</strong>
                <span>{item.reason}</span>
              </div>
              <div className="cleanup-card-meta">
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="backup-list">
          {backupSurfaces.map((backup) => (
            <div className="backup-card" key={backup.name}>
              <div>
                <span className="summary-label">{backup.name}</span>
                <strong>{backup.size}</strong>
                <span>{backup.path}</span>
              </div>
              <div>
                <span className={`state-pill ${backup.state.replaceAll(" ", "-")}`}>
                  {backup.state}
                </span>
                <span>{backup.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="backup-breakdown-grid">
          {backupBreakdown.map((item) => (
            <article className="backup-breakdown-card" key={item.name}>
              <div>
                <span className="summary-label">{item.name}</span>
                <strong>{item.size}</strong>
                <span>{item.path}</span>
              </div>
              <p>{item.signal}</p>
              <div>
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
                <span>{item.action}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="backup-breakdown-grid">
          {sbl2RetirementFindings.map((item) => (
            <article className="backup-breakdown-card" key={item.name}>
              <div>
                <span className="summary-label">{item.name}</span>
                <strong>{item.size}</strong>
                <span>{item.path}</span>
              </div>
              <p>{item.signal}</p>
              <div>
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="prune-panel">
          <div className="prune-panel-heading">
            <span className="summary-label">Applied prune candidates</span>
            <strong>73GiB pruned. Follow-up dry-run reports 0B remaining.</strong>
          </div>
          <div className="prune-list">
            {backupPruneCandidates.map((candidate) => (
              <div className="prune-row" key={candidate.path}>
                <span>{candidate.path}</span>
                <strong>{candidate.size}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="cleanup-queue">
          {homeCleanupQueue.map((item) => (
            <article className="cleanup-card" key={item.name}>
              <div className="cleanup-card-main">
                <span className="summary-label">{item.name}</span>
                <strong>{item.currentPath}</strong>
                <span>{item.targetPath}</span>
              </div>
              <div className="cleanup-card-meta">
                <span className={`state-pill ${item.state.replaceAll(" ", "-")}`}>
                  {item.state}
                </span>
                <span>{item.size}</span>
              </div>
              <p>{item.rule}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "actions") {
    return (
      <ol className="action-list">
        {nextActions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ol>
    );
  }

  return null;
}

export default function Home() {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [quickOpenClawMessage, setQuickOpenClawMessage] = useState("");

  const operatorProgram = projectPrograms[0];
  const activeLane = projectDecisionLanes.find((lane) => lane.name === "Build now") ?? projectDecisionLanes[0];
  const nextLane = projectDecisionLanes.find((lane) => lane.name === "Decide next") ?? projectDecisionLanes[1];
  const dirtyProjectCount = projectPortfolio.filter((project) => project.dirtyCount > 0).length;
  const vaultCount = secretInventory.filter((secret) => secret.state === "vault").length;
  const missingSecretCount = secretInventory.filter((secret) => secret.state === "missing").length;
  const guardedShortcutCount = shortcutInventory.filter((shortcut) => shortcut.state === "guarded").length;
  const openClawNode = operatingNodes.find((node) => node.id === "openclaw");

  const handleQuickOpenClawSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActivePanel("openclaw");
  };

  return (
    <>
      <section className="cockpit-home" aria-label="Personal cockpit">
        <div className="cockpit-utility-row">
          <div className="mantra-button-row" aria-label="Mantra panels">
            <button className="cockpit-tab" onClick={() => setActivePanel("mantras")} type="button">
              My Mantra
            </button>
            <button className="cockpit-tab" onClick={() => setActivePanel("dna")} type="button">
              LLM Mantra
            </button>
          </div>
          <div className="header-actions">
            <button
              aria-label="Reload dashboard"
              className="reload-button"
              onClick={() => window.location.reload()}
              title="Reload dashboard"
              type="button"
            >
              ↻
            </button>
            <ApiStatus />
          </div>
        </div>

        <section className="home-core-grid" aria-label="Projects and infrastructure">
          <article className="home-card home-projects-card">
            <button className="home-card-hit" onClick={() => setActivePanel("projects")} type="button">
              <span className="summary-label">Projects</span>
              <strong>{operatorProgram.name}</strong>
              <span className="home-card-action">Open</span>
            </button>
            <p>{operatorProgram.outcome}</p>
            <div className="home-decision-grid">
              <div>
                <span>current bet</span>
                <strong>{operatorProgram.currentBet}</strong>
              </div>
              <div>
                <span>next decision</span>
                <strong>{operatorProgram.nextDecision}</strong>
              </div>
            </div>
            <div className="home-mini-row">
              <span className="state-pill active">{activeLane.projects.join(" + ")}</span>
              <span className="state-pill review">{dirtyProjectCount} dirty</span>
              <span className="state-pill next">{nextLane.projects.length} decisions</span>
            </div>
          </article>

          <article className="home-card home-infra-card">
            <button className="home-card-hit" onClick={() => setActivePanel("infra")} type="button">
              <span className="summary-label">Infra</span>
              <strong>Vault, access, domains, machines</strong>
              <span className="home-card-action">Open</span>
            </button>
            <div className="home-infra-metrics">
              <div>
                <strong>{vaultCount}</strong>
                <span>vault secrets</span>
              </div>
              <div>
                <strong>{domainSurfaces.length}</strong>
                <span>domains</span>
              </div>
              <div>
                <strong>{machineFacts[1]?.value ?? "LAN"}</strong>
                <span>phone route</span>
              </div>
              <div>
                <strong>{guardedShortcutCount}</strong>
                <span>guarded shortcuts</span>
              </div>
            </div>
            <div className="home-mini-row">
              <span className="state-pill vault">sbl0 vault</span>
              <span className={`state-pill ${missingSecretCount > 0 ? "missing" : "safe"}`}>
                {missingSecretCount} missing
              </span>
              {openClawNode ? (
                <span className={`state-pill ${openClawNode.state}`}>openclaw {openClawNode.state}</span>
              ) : null}
            </div>
          </article>
        </section>

        <section className="home-card home-telemetry-card" aria-label="Telemetry">
          <button className="home-card-hit" onClick={() => setActivePanel("telemetry")} type="button">
            <span className="summary-label">Telemetry</span>
            <strong>Fleet health and machine pressure</strong>
            <span className="home-card-action">Open</span>
          </button>
          <FleetStatus />
        </section>

        <form className="home-openclaw-tray" onSubmit={handleQuickOpenClawSubmit}>
          <button
            className="openclaw-tray-project"
            onClick={() => setActivePanel("openclaw")}
            type="button"
          >
            <span>OpenClaw project</span>
            <strong>Cloudflare tunnel + multimodal agent bridge</strong>
          </button>
          <input
            aria-label="Message OpenClaw"
            onChange={(event) => setQuickOpenClawMessage(event.target.value)}
            placeholder="Talk to OpenClaw..."
            value={quickOpenClawMessage}
          />
          <button className="openclaw-tray-send" type="submit">
            Open
          </button>
        </form>
      </section>

      {activePanel ? (
        <div
          aria-modal="true"
          className="panel-overlay"
          onClick={() => setActivePanel(null)}
          role="dialog"
        >
          <section className="glass-panel dashboard-section focus-panel" onClick={(event) => event.stopPropagation()}>
            <div className="section-heading focus-panel-heading">
              <PanelTitle panel={activePanel} />
              <button className="panel-close" onClick={() => setActivePanel(null)} type="button">
                Close
              </button>
            </div>
            <div className="focus-panel-body">
              <PanelBody panel={activePanel} />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

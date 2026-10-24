import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const EXTREMELY_IMPORTANT_MARKER = "<EXTREMELY_IMPORTANT>";
const BOOTSTRAP_MARKER = "superpowers:using-superpowers bootstrap for pi";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(extensionDir, "../..");
const skillsDir = resolve(packageRoot, "skills");
const bootstrapSkillPath = resolve(skillsDir, "using-superpowers", "SKILL.md");
const SKILL_URL = /skill:\/\/([a-z0-9][a-z0-9-]*)/g;
// An SDD workspace directory, as sdd-workspace prints it or as part of a path
// into it; the ledger is its progress.md. Dot-names (`.gitignore`) and the old
// flat `.superpowers/sdd/progress.md`, which SDD's own text mentions, are not plans.
const SDD_WORKSPACE = /[^\s"'`()<>[\]\\]*\.superpowers\/sdd\/[A-Za-z0-9_-]+(?![\w.-])/g;
const MAX_SKILLS_NAMED = 4;

let cachedBootstrap: string | null | undefined;
let cachedSkillNames: Set<string> | undefined;

export default function superpowersPiExtension(pi: ExtensionAPI) {
	let injectBootstrap = true;

	pi.on("resources_discover", async () => ({
		skillPaths: [skillsDir],
	}));

	pi.on("session_start", async () => {
		injectBootstrap = true;
	});

	pi.on("session_compact", async () => {
		injectBootstrap = true;
	});

	// The compaction summary does not carry skill text. Name the superpowers
	// skills read before it and the plan's ledger, so the agent reads them again.
	pi.on("session.compacting", async (event) => {
		const context = compactionContext(event?.messages ?? []);
		return context.length > 0 ? { context } : undefined;
	});

	pi.on("session_switch", async () => {
		injectBootstrap = true;
	});

	pi.on("agent_end", async (event) => {
		if (event?.willContinue) return;
		injectBootstrap = false;
	});

	pi.on("context", async (event, ctx) => {
		if (ctx?.agent?.kind === "sub") return;
		if (!injectBootstrap) return;
		if (event.messages.some(messageContainsBootstrap)) return;

		const bootstrap = getBootstrapContent();
		if (!bootstrap) return;

		const content: Array<{ type: "text"; text: string }> = [{ type: "text", text: bootstrap }];
		// After a compaction, name the superpowers skills and ledger used before it.
		// Read from the session branch, so it holds whatever the compaction method
		// and also after a restart or `omp -c`.
		if (event.messages.some((message) => field(message, "role") === "compactionSummary")) {
			const note = compactionContext(messagesBeforeLatestCompaction(ctx));
			if (note.length > 0) content.push({ type: "text", text: note.join("\n") });
		}
		const bootstrapMessage = {
			role: "user" as const,
			content,
			timestamp: Date.now(),
		};

		const insertAt = firstNonCompactionSummaryIndex(event.messages);
		return {
			messages: [
				...event.messages.slice(0, insertAt),
				bootstrapMessage,
				...event.messages.slice(insertAt),
			],
		};
	});
}

function getBootstrapContent(): string | null {
	if (cachedBootstrap !== undefined) return cachedBootstrap;

	try {
		const skillContent = readFileSync(bootstrapSkillPath, "utf8");
		const body = stripFrontmatter(skillContent);
		cachedBootstrap = `${EXTREMELY_IMPORTANT_MARKER}
${BOOTSTRAP_MARKER}

You have superpowers.

The using-superpowers skill content is included below and is already loaded for this Pi session. Follow it now. Do not try to load using-superpowers again.

${body}

${piToolMapping()}
</EXTREMELY_IMPORTANT>`;
		return cachedBootstrap;
	} catch {
		cachedBootstrap = null;
		return null;
	}
}

function stripFrontmatter(content: string): string {
	const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
	return (match ? match[1] : content).trim();
}

function piToolMapping(): string {
	return `## omp tool mapping

This harness is omp (Oh My Pi). It has native skills but does not expose Claude Code's \`Skill\` tool. When a Superpowers instruction says to invoke a skill, read it with \`read skill://<name>\` when the skill applies, or let a human invoke \`/skill:name\` explicitly. Superpowers text names skills \`superpowers:<name>\`; read them as \`skill://<name>\`, without the prefix. \`read skill://superpowers:brainstorming\` returns "Unknown skill".

omp's built-in coding tools are lowercase: \`read\`, \`write\`, \`edit\`, \`bash\`, \`grep\`, \`glob\`. Use \`read\` for a file OR a directory listing, \`grep\` for file contents, and \`glob\` for finding paths by name. omp's own system prompt directs you to prefer these over shell \`ls\`, \`find\`, \`grep\`, and \`rg\`; follow that preference.

omp ships a built-in subagent tool: \`task\`. Use it for all Superpowers subagent workflows. Batch shape (the \`task.batch\` setting, on by default): ONE call carries \`{ context, tasks[] }\` — one subagent per item, run concurrently. Every item also needs \`solutionSpace\`, one line on how open the problem is. Dispatch N parallel subagents as N entries in a single \`task\` call, never N sequential calls. Pick the most specific agent type per item from the roster in the \`task\` tool's own description (typically \`scout\` for read-only research, \`reviewer\`, \`security-reviewer\`, \`sonic\` for strictly mechanical work, and \`task\` for general-purpose). The tool is lowercase \`task\`; \`Task\` does not exist here. Never conclude that subagent capability is missing.

To resume an idle subagent with new input, message it with \`write agent://<id>\`, using the id its result reports. A result longer than 5,000 characters arrives as a preview; read the rest at \`agent://<id>\`.

The \`task\` tool has NO \`model:\` field — a template's \`model:\` line is inert; the agent TYPE carries the model, thinking level, and tools. For subagent-driven-development use this plugin's own agents: \`sdd-implementer\` (implementation, fix rounds 1-2), \`sdd-escalation-implementer\` (fix round 3, and tasks ruled to need the strongest tier), \`sdd-reviewer\` (task review), \`sdd-rereviewer\` (scoped re-review), \`sdd-final-reviewer\` (whole-branch review). Each agent file sets a default model and thinking level; a host re-points any seat with \`task.agentModelOverrides\`. Never use the bundled \`task\` agent for an SDD seat: it lacks the seat's tools, output contract and no-subagent rule.

omp ships a built-in task-list tool: \`todo\` (\`init\`, \`start\`, \`done\`, \`rm\`, \`drop\`, \`block\`, \`unblock\`, \`append\`, \`view\`). Use it for all task tracking. Do not track work in plan files or a repo-local \`TODO.md\`. Treat older \`TodoWrite\` references as the \`todo\` tool.

From omp 18.4.12 every subagent is told to leave builds, tests and smoke runs to the main agent unless its assignment explicitly instructs them: name the checks a subagent must run in its dispatch.

If your tools include \`vibe_spawn\` but not \`task\`, omp's vibe mode is on and you are its director: you have none of the \`task\`, \`bash\`, \`edit\` or \`write\` tools named above. Read the "Vibe mode" section of \`skill://using-superpowers/references/pi-tools.md\` before acting on them.`;
}

// Reads one property of an unknown value; undefined unless it is an object holding it.
function field(value: unknown, key: string): unknown {
	return value !== null && typeof value === "object" && key in value ? Reflect.get(value, key) : undefined;
}

function messagesBeforeLatestCompaction(ctx: unknown): unknown[] {
	const sessionManager = field(ctx, "sessionManager");
	const getBranch = field(sessionManager, "getBranch");
	if (typeof getBranch !== "function") return [];
	let entries: unknown;
	try {
		entries = getBranch.call(sessionManager);
	} catch {
		return [];
	}
	if (!Array.isArray(entries)) return [];
	let end = -1;
	entries.forEach((entry, index) => {
		if (field(entry, "type") === "compaction") end = index;
	});
	return entries
		.slice(0, Math.max(end, 0))
		.filter((entry) => field(entry, "type") === "message")
		.map((entry) => field(entry, "message"));
}

function compactionContext(messages: unknown[]): string[] {
	const ours = superpowersSkillNames();
	const skills: string[] = [];
	let ledger: string | undefined;

	for (const message of messages) {
		for (const part of contentParts(message)) {
			if (part.type === "toolCall") {
				const args = JSON.stringify(part.arguments ?? {});
				for (const match of args.matchAll(SKILL_URL)) {
					const name = match[1];
					if (!ours.has(name)) continue;
					const seen = skills.indexOf(name);
					if (seen !== -1) skills.splice(seen, 1);
					skills.push(name);
				}
				ledger = lastLedgerPath(args) ?? ledger;
			} else if (part.type === "text" && typeof part.text === "string") {
				ledger = lastLedgerPath(part.text) ?? ledger;
			}
		}
	}

	if (skills.length === 0) return [];
	const named = skills.slice(-MAX_SKILLS_NAMED).map((name) => `skill://${name}`).join(", ");
	const lines = [
		`Superpowers skills in use before this compaction (most recent last): ${named}. This summary does not carry their text: before your next step, read again the ones you are still following.`,
	];
	if (ledger) {
		lines.push(`Superpowers ledger: ${ledger}. Read it before you continue; it records what is done and what is next.`);
	}
	return lines;
}

function superpowersSkillNames(): Set<string> {
	if (cachedSkillNames) return cachedSkillNames;
	try {
		cachedSkillNames = new Set(
			readdirSync(skillsDir, { withFileTypes: true })
				.filter((entry) => entry.isDirectory() && existsSync(resolve(skillsDir, entry.name, "SKILL.md")))
				.map((entry) => entry.name),
		);
	} catch {
		cachedSkillNames = new Set();
	}
	// The bootstrap re-injects using-superpowers after every compaction already.
	cachedSkillNames.delete("using-superpowers");
	return cachedSkillNames;
}

function contentParts(message: unknown): Array<{ type?: unknown; text?: unknown; arguments?: unknown }> {
	const content = field(message, "content");
	if (typeof content === "string") return [{ type: "text", text: content }];
	if (!Array.isArray(content)) return [];
	return content
		.filter((part) => part !== null && typeof part === "object")
		.map((part) => ({ type: field(part, "type"), text: field(part, "text"), arguments: field(part, "arguments") }));
}

function lastLedgerPath(text: string): string | undefined {
	const matches = text.match(SDD_WORKSPACE);
	return matches ? `${matches[matches.length - 1]}/progress.md` : undefined;
}

function messageContainsBootstrap(message: unknown): boolean {
	const content = (message as { content?: unknown }).content;
	if (typeof content === "string") return content.includes(BOOTSTRAP_MARKER);
	if (!Array.isArray(content)) return false;
	return content.some((part) => {
		return (
			part &&
			typeof part === "object" &&
			(part as { type?: unknown }).type === "text" &&
			typeof (part as { text?: unknown }).text === "string" &&
			(part as { text: string }).text.includes(BOOTSTRAP_MARKER)
		);
	});
}

function firstNonCompactionSummaryIndex(messages: unknown[]): number {
	let index = 0;
	while ((messages[index] as { role?: unknown } | undefined)?.role === "compactionSummary") {
		index += 1;
	}
	return index;
}

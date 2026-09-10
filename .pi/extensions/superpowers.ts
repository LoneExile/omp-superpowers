import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const EXTREMELY_IMPORTANT_MARKER = "<EXTREMELY_IMPORTANT>";
const BOOTSTRAP_MARKER = "superpowers:using-superpowers bootstrap for pi";

const extensionDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(extensionDir, "../..");
const skillsDir = resolve(packageRoot, "skills");
const bootstrapSkillPath = resolve(skillsDir, "using-superpowers", "SKILL.md");

let cachedBootstrap: string | null | undefined;

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

	pi.on("agent_end", async () => {
		injectBootstrap = false;
	});

	pi.on("context", async (event) => {
		if (!injectBootstrap) return;
		if (event.messages.some(messageContainsBootstrap)) return;

		const bootstrap = getBootstrapContent();
		if (!bootstrap) return;

		const bootstrapMessage = {
			role: "user" as const,
			content: [{ type: "text" as const, text: bootstrap }],
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

This harness is omp (Oh My Pi). It has native skills but does not expose Claude Code's \`Skill\` tool. When a Superpowers instruction says to invoke a skill, read it with \`read skill://<name>\` when the skill applies, or let a human invoke \`/skill:name\` explicitly.

omp's built-in coding tools are lowercase: \`read\`, \`write\`, \`edit\`, \`bash\`, \`grep\`, \`glob\`. Use \`read\` for a file OR a directory listing, \`grep\` for file contents, and \`glob\` for finding paths by name. omp's own system prompt directs you to prefer these over shell \`ls\`, \`find\`, \`grep\`, and \`rg\`; follow that preference.

omp ships a built-in subagent tool: \`task\`. Use it for all Superpowers subagent workflows. Batch shape: ONE call carries \`{ context, tasks[] }\` — one subagent per item, run concurrently. Dispatch N parallel subagents as N entries in a single \`task\` call, never N sequential calls. Pick the most specific agent type per item from the roster in the \`task\` tool's own description (typically \`scout\` for read-only research, \`reviewer\`, \`security-reviewer\`, \`sonic\` for strictly mechanical work, and \`task\` for general-purpose). The tool is lowercase \`task\`; \`Task\` does not exist here. Never conclude that subagent capability is missing.

The \`task\` tool has NO \`model:\` field — a template's \`model:\` line is inert; the agent TYPE carries the model, thinking level, and tools. For subagent-driven-development use this plugin's own agents: \`sdd-implementer\` (implementation, fix rounds 1-2), \`sdd-escalation-implementer\` (fix round 3, most capable tier), \`sdd-reviewer\` (task review, no file writes, no shell), \`sdd-rereviewer\` (scoped re-review, cheap tier), \`sdd-final-reviewer\` (whole-branch review, most capable tier). The bundled \`task\` agent resolves to \`modelRoles.task\`, whatever that is — never use it for an SDD seat.

omp ships a built-in task-list tool: \`todo\` (\`init\`, \`start\`, \`done\`, \`rm\`, \`drop\`, \`block\`, \`unblock\`, \`append\`, \`view\`). Use it for all task tracking. Do not track work in plan files or a repo-local \`TODO.md\`. Treat older \`TodoWrite\` references as the \`todo\` tool.`;
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

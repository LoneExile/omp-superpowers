import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const extensionPath = resolve(repoRoot, '.pi/extensions/superpowers.ts');
const piToolsPath = resolve(repoRoot, 'skills/using-superpowers/references/pi-tools.md');

async function readPackageJson() {
  return JSON.parse(await readFile(packageJsonPath, 'utf8'));
}

async function loadExtension() {
  const handlers = new Map();
  const pi = {
    on(event, handler) {
      if (!handlers.has(event)) handlers.set(event, []);
      handlers.get(event).push(handler);
    },
  };
  const mod = await import(pathToFileURL(extensionPath).href + `?cachebust=${Date.now()}-${Math.random()}`);
  mod.default(pi);
  return { handlers };
}

function firstHandler(handlers, event) {
  const eventHandlers = handlers.get(event) ?? [];
  assert.equal(eventHandlers.length, 1, `expected one ${event} handler`);
  return eventHandlers[0];
}

function textOf(message) {
  if (typeof message.content === 'string') return message.content;
  return message.content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

test('package.json declares a pi package with skills and extension resources', async () => {
  const pkg = await readPackageJson();

  assert.ok(pkg.keywords.includes('pi-package'));
  assert.deepEqual(pkg.pi.skills, ['./skills']);
  assert.deepEqual(pkg.pi.extensions, ['./.pi/extensions/superpowers.ts']);
});

test('extension registers lifecycle hooks without pre-compaction injection', async () => {
  const { handlers } = await loadExtension();

  for (const event of ['resources_discover', 'session_start', 'session_compact', 'context', 'agent_end']) {
    assert.equal((handlers.get(event) ?? []).length, 1, `missing ${event} handler`);
  }
  assert.equal((handlers.get('session_before_compact') ?? []).length, 0);
});

test('resources_discover contributes the bundled skills directory', async () => {
  const { handlers } = await loadExtension();
  const discover = firstHandler(handlers, 'resources_discover');

  const result = await discover({ type: 'resources_discover', cwd: repoRoot, reason: 'startup' }, {});

  assert.deepEqual(result.skillPaths, [resolve(repoRoot, 'skills')]);
});

test('startup context injects the bootstrap as one user message until agent_end', async () => {
  const { handlers } = await loadExtension();
  const sessionStart = firstHandler(handlers, 'session_start');
  const context = firstHandler(handlers, 'context');
  const agentEnd = firstHandler(handlers, 'agent_end');

  await sessionStart({ type: 'session_start', reason: 'startup' }, {});

  const originalMessages = [
    { role: 'user', content: [{ type: 'text', text: 'Let us make a react todo list' }], timestamp: 1 },
  ];
  const result = await context({ type: 'context', messages: originalMessages }, {});

  assert.equal(result.messages.length, 2);
  assert.equal(result.messages[0].role, 'user');
  assert.match(textOf(result.messages[0]), /You have superpowers/);
  assert.match(textOf(result.messages[0]), /omp tool mapping/);
  assert.equal(result.messages[1], originalMessages[0]);

  const repeatedProviderRequest = await context({ type: 'context', messages: originalMessages }, {});
  assert.equal(repeatedProviderRequest.messages.length, 2);
  assert.match(textOf(repeatedProviderRequest.messages[0]), /You have superpowers/);

  const alreadyInjected = await context({ type: 'context', messages: result.messages }, {});
  assert.equal(alreadyInjected, undefined, 'bootstrap should not duplicate when already present');

  await agentEnd({ type: 'agent_end', messages: [] }, {});
  const afterEnd = await context({ type: 'context', messages: originalMessages }, {});
  assert.equal(afterEnd, undefined, 'startup bootstrap should clear after agent_end');
});

test('session_compact injects bootstrap after compaction summaries, not before compaction', async () => {
  const { handlers } = await loadExtension();
  const sessionCompact = firstHandler(handlers, 'session_compact');
  const context = firstHandler(handlers, 'context');

  await sessionCompact({ type: 'session_compact', compactionEntry: {}, fromExtension: false }, {});

  const summary = { role: 'compactionSummary', summary: 'Prior work summary', tokensBefore: 123, timestamp: 1 };
  const user = { role: 'user', content: [{ type: 'text', text: 'Continue' }], timestamp: 2 };
  const result = await context({ type: 'context', messages: [summary, user] }, {});

  assert.equal(result.messages.length, 3);
  assert.equal(result.messages[0], summary);
  assert.equal(result.messages[1].role, 'user');
  assert.match(textOf(result.messages[1]), /You have superpowers/);
  assert.equal(result.messages[2], user);
});

test('pi tools reference documents pi-specific mappings', async () => {
  assert.equal(existsSync(piToolsPath), true, 'pi-tools.md should exist');
  const text = await readFile(piToolsPath, 'utf8');

  // Assert against the first (action-mapping) table only. Surrounding prose and
  // the seat table mention these tokens, so matching the whole file would still
  // pass if the action table were deleted.
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('|'));
  assert.notEqual(start, -1, 'action mapping table exists');
  let end = start;
  while (end < lines.length && lines[end].startsWith('|')) end++;
  const rows = lines.slice(start, end);
  assert.ok(
    rows.some((row) => /subagent/i.test(row) && /`task`/.test(row)),
    'action table maps subagent dispatch to task',
  );
  assert.ok(
    rows.some((row) => /task tracking/i.test(row) && /`todo`/.test(row)),
    'action table maps task tracking to todo',
  );
});

test('pi tools seat table lists exactly the agents shipped in agents/*.md', async () => {
  const agentsDir = resolve(repoRoot, 'agents');
  const names = [];
  for (const file of (await readdir(agentsDir)).filter((f) => f.endsWith('.md'))) {
    const m = (await readFile(resolve(agentsDir, file), 'utf8')).match(/^---\n([\s\S]*?)\n---/);
    const name = m?.[1].match(/^name:\s*(\S+)\s*$/m)?.[1];
    assert.ok(name, `${file} has a name: frontmatter`);
    names.push(name);
  }
  assert.equal(names.length, 5);

  const text = await readFile(piToolsPath, 'utf8');
  const seatNames = text
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .map((row) => row.match(/`(sdd-[a-z-]+)`/)?.[1])
    .filter(Boolean);
  assert.deepEqual([...seatNames].sort(), [...names].sort());
});

test('session_switch re-arms the bootstrap after agent_end', async () => {
  const { handlers } = await loadExtension();
  const context = firstHandler(handlers, 'context');
  const messages = [{ role: 'user', content: [{ type: 'text', text: 'hi' }], timestamp: 1 }];

  await firstHandler(handlers, 'agent_end')({ type: 'agent_end', messages: [] }, {});
  assert.equal(await context({ type: 'context', messages }, {}), undefined);

  await firstHandler(handlers, 'session_switch')({ type: 'session_switch', reason: 'new' }, {});
  const result = await context({ type: 'context', messages }, {});
  assert.equal(result.messages.length, 2);
  assert.match(textOf(result.messages[0]), /You have superpowers/);
});

test('agent_end with willContinue does not stop injection', async () => {
  const { handlers } = await loadExtension();
  const context = firstHandler(handlers, 'context');
  const messages = [{ role: 'user', content: [{ type: 'text', text: 'hi' }], timestamp: 1 }];

  await firstHandler(handlers, 'agent_end')({ type: 'agent_end', messages: [], willContinue: true }, {});
  const result = await context({ type: 'context', messages }, {});
  assert.equal(result.messages.length, 2);
});

test('context skips subagent sessions but injects for the main agent', async () => {
  const { handlers } = await loadExtension();
  const context = firstHandler(handlers, 'context');
  const messages = [{ role: 'user', content: [{ type: 'text', text: 'hi' }], timestamp: 1 }];

  assert.equal(await context({ type: 'context', messages }, { agent: { kind: 'sub' } }), undefined);
  const result = await context({ type: 'context', messages }, { agent: { kind: 'main' } });
  assert.equal(result.messages.length, 2);
});

test('.omp-plugin/plugin.json exists and is a JSON object', async () => {
  const manifestPath = resolve(repoRoot, '.omp-plugin/plugin.json');
  assert.equal(existsSync(manifestPath), true);
  const parsed = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.ok(parsed && typeof parsed === 'object' && !Array.isArray(parsed));
});

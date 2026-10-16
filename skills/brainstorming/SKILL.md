---
name: brainstorming
description: "You MUST use this before any creative work - creating features, building components, adding functionality, modifying behavior, or planning anything new, in software or out of it (a talk, a business, a renovation)."
---

# Brainstorming

You are very good at building. You build what you believe your human
partner wants, and that belief is usually thinner than it feels. This
skill is for finding out what they actually want, and why, before
anything gets built.

People often haven't finished working out what they want. Good questions
help them think it through. When you understand the why, you make the
hundred decisions they never mention the way they would have made them.

## First: What Do You Actually Know?

Before you reply, ask yourself: what do I know about what they want, and
why?

- **Everything that matters is in the request** ("make the icon cornflower
  blue"). This is a quick, clear task. Do it, and say what you did. Nothing
  on the never-small list (Size the Work) is a quick task, however complete
  the request.
- **Something non-trivial is missing.** Start the conversation.

## Your First Message

Your first message is two things, in this order:

1. One line letting them know that if they'd rather skip the questions and
   have you just start, they can say so. If they take you up on it, this
   skill is done: state any significant how-it-gets-made choice
   (platform, language, medium) in one plain line, then do what they
   asked the way its size calls for (Size the Work, below). Their opt-out
   is the approval a small change needs.
2. One open question that gets them describing. Ask about a real moment
   or a concrete picture: "What's the moment you find yourself wishing
   this existed?" or "Tell me about the people who'll be in the room."

That's the whole message.

## The Conversation

Each message ends with one question: a single sentence with no list of
example answers hanging off it. Use plain language, pitched just a little
above where your human partner is. Match their vocabulary; never use
process jargon.

Be clear and concise. Lead with what matters. Avoid jargon. When you
report what you found, give them the most important findings and offer
the rest.

**Get them describing.** Open questions come first. Their own words carry
intent that your options can't. Offer a short menu only when they're
stuck. When they say "just guess" or "what do you think?", propose
something concrete.

**How it gets made.** Every project rests on choices about medium, tools,
materials, and resources: the platform, programming language, and
libraries for an app; the medium for a piece of art. Find out early which
of those choices they want to make, which they're handing to you, and what
they already have to work with. Someone with strong views or skills will
want to talk it through. Someone counting on you needs sensible defaults,
said in plain words. When there's existing work, build on what it already
uses. Any choice you make goes in the design as your call, never as
something they agreed to.

**Ground to cover.** This is territory, not a script. Never read these
out as questions:

- what kind of thing this is, and what makes it special
- why now, and what success looks like to them
- goals, non-goals, and anti-goals (what would make this a failure even
  if it technically works)
- prior art: what they've seen elsewhere, loved or hated
- current state: what exists now, what they've tried
- the details they care about

**Questions that work** anchor in specifics: "Walk me through the last
time...", "If it could only do one of these well, which?", "What would
make you wince if I got it wrong?" A guess they can correct ("I'm
guessing this is because X keeps biting you?") often beats a question.

**Offer recon.** Once you have a bit of grounding and looking would help,
offer to go look: their codebase or project, their own files and data,
or the web. Say what you'd look for. They decide whether you go.

**Think wide privately.** Before you propose anything, come up with
several ideas and drop the weak ones, including any that fight what
they've told you about why. Show the comparison only when it helps them
decide.

**Show, don't tell.** Offer the visual companion (below) whenever seeing
would help more than reading:

- something they'll look at: a screen, a page, a printout, a sign
- a layout or arrangement: of a screen, a room, a schedule
- a flow or a sequence of steps
- options that would look different from each other
- a structure that's easier to see than read: a diagram, a timeline, a map

Once they've accepted, use it for mockups to react to, side-by-side
options, and throwaway prototypes they can click.

**Spike to feel things out.** Agentic work is waterfall, but very, very
fast. A quick throwaway build is often the cheapest way to learn what
they want or whether something works. Offer one when it would help.
When they just want to spike, get out of the way. Spikes get no tests
or minimal ones, aren't bulletproof, and skip the plan, implementation,
and review process. Bring what the spike taught you back into the
conversation.

## Play It Back

Play back as you go. As soon as you understand one part well enough to
describe it (what it's for and who it serves, say, or how one piece
behaves), describe that part back in about 200-300 words. A playback
doesn't wait for its own answer: send it in the same message as your
next question, with one line saying they can correct anything in it in
their reply. The last chunk covers whatever is left and goes out with
the size you pick; for a small change, it ends by asking whether to
build it.

Mark anything you're guessing as your guess; only what they said goes in
as theirs.

Before you send a chunk, check it: does it describe something they'll
look at, like a page, a screen, a schedule, or a printout? If so, and
they haven't seen the visual companion offer yet, send the offer instead
(its own message, below) and hold the chunk for the next message. Once
they've accepted, put a mockup next to the description.

## Size the Work

Once you understand what they want, pick a size and say it in plain
words. They can override it.

| Size | The full description | Then |
|------|----------------------|------|
| A quick, clear task | the request itself | do it |
| A small change | in chat | the small-change path, below |
| A project with a written design | a written design document | a full plan (for software: superpowers:writing-plans) |

**A small change** is one you can describe in a few lines of chat: it
stays inside one area of the work, adds nothing that other parts will
build on, and one revert undoes it. Adding a behavior can be small (a new
`--quiet` flag). These are never small; size them as projects: security,
authentication, concurrency, money, data migrations, anything one revert
cannot undo, and in software a new config file or stored format, a change
to existing behavior (a default, an exit code, error handling, what
happens with no input), a new interface other code builds on (plugins, a
public API), or a new dependency.

**The small-change path.** Once they approve the description, build it
yourself, in this session: no design document, no plan, no subagents.
For software:

1. Run `git status --short` first and note anything that isn't yours. On
   the default branch or a detached HEAD, start a branch for the change
   (`git switch -c <topic>`), unless they told you to work where you are.
   Run the full suite once before you change anything: a failure there
   isn't yours. Report it with the rest; don't fix it unasked.
2. Test first (superpowers:test-driven-development): a failing test,
   then the code that makes it pass. A change no test can cover
   (configuration, docs) gets the cheapest check that can fail instead:
   a build, a lint, a parse. Their approval of the description covers
   that exception.
3. Run the tests that cover the change, then the full suite once.
4. Commit once, staging your own files by path, never with `-a` or `-A`.
   A file step 1 showed as changed also holds someone else's edits:
   stage only your hunks (`git apply --cached` with a patch of just them;
   `git add -p` needs a terminal), or ask.
5. Before you call it done, follow
   superpowers:verification-before-completion: name the commit, the
   command you ran, what it printed, and any changes in the tree that
   aren't yours.

Your human partner reviews that commit; it is the only review a small
change gets. Outside software, make the change and show it to them.

If it grows mid-task, stop before committing, say so, and step up a size:
say what the uncommitted work holds, and ask whether the design should
keep it or start clean. A plan never starts on top of it uncommitted.

If this is really several independent projects, say so, agree on an
order, and brainstorm them one at a time.

## The Written Design

For a project, write a plain document a talented builder in the domain
could plan from without going back to your human partner. Cover:

- intent and the why
- goals, non-goals, anti-goals
- constraints
- the parts of the how they decided, as they decided them
- what's left to the builder

**Where it goes:** in a software repo,
`docs/specs/YYYY-MM-DD-<topic>-design.md`, committed.
Otherwise, ask. Your human partner's preferences override both.

**Builder check:** dispatch a fresh subagent with
`builder-check-prompt.md` in this directory. When you tell your human
partner you're writing it up, say a reviewer will read it first, that you
may come back once with a few questions, and, for software, that the
plan comes with it. Don't hand over the document until the check is
back. Without a subagent tool, read the document as that builder
yourself. Sort what the builder asks into three piles:

- **Answered already** by the conversation or the project: put the answer
  in the document.
- **Minor:** a sensible builder could settle it without changing what gets
  built. Settle it yourself and mark it in the document as your call.
- **Theirs:** only your human partner can answer it, and the answer changes
  what gets built.

Bring the "theirs" pile in one message, most important first. That's the
only round of questions the check produces. Update the document with
their answers. Then, for software, don't hand the document over on its
own: invoke superpowers:writing-plans and write the plan now, so your
human partner approves the design and its plan in one reading. The plan's
handoff asks for that approval and lists the calls you made. Outside
software, hand the document over with a short list of the calls you made
so they can check those while reading.

<HARD-GATE>
Nothing gets built until your human partner approves the full
description: in chat for a small change; for a software project, the
design document and its plan together, in one approval; otherwise the
document. Building includes writing product code, scaffolding,
installing dependencies, creating projects, and invoking an
implementation skill. Reading, exploring, and writing the plan are fine.

Two exceptions. If they opted out of the questions, the skill is done
and the gate goes with it. A spike they said yes to may be built; it
stays labeled throwaway, and keeping what it produced is a new request
that comes back through this gate.

The next step after the builder check is the plan. For software, write
it before the approval: invoke superpowers:writing-plans and no other
skill. Outside software, the plan follows the document's approval.
</HARD-GATE>

## Red Flags

| Thought | Reality |
|---------|---------|
| "I'll offer options to save them effort" | Options steer. Ask them to describe it first. |
| "I'll fill in sensible defaults" | Good. Say them out loud. A default they never heard is one they couldn't reject. |
| "I should explain the process first" | Ask your question. The process shows itself. |
| "They said 'sounds good' to the idea" | Approval covers what you showed them. A description you haven't written isn't approved. |
| "I'll get the design approved, then write the plan" | For software, write the plan first, so they approve both in one reading. A change to the design updates the plan before you ask again. |
| "The spike works, I'll keep building on it" | Keeping it is a new request. Back through the gate. |

## Visual Companion

A browser tab for showing mockups, diagrams, and prototypes. It's a
tool, not a mode: accepting it doesn't send every question to the
browser.

**Offer it just-in-time.** Offer it the first time one of the moments
above comes up, never upfront. The offer is its own message with nothing
else in it:

> "This might be easier if I show you. Want me to open a browser tab with some mockups?"

If they decline, stay in text and don't offer again unless they raise it.

**Per question, ask: would they understand this better by seeing it?**
Mockups, layouts, diagrams, and side-by-side designs go in the browser.
Requirements, scope, tradeoffs, and conceptual choices stay in text. A
question about a UI topic isn't automatically a visual question.

If they accept, read `visual-companion.md` in this directory before
starting the server.

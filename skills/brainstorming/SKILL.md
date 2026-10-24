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
  blue"). This is a quick, clear task. Do it, and say what you did. If
  doing it means making choices they would see that the request leaves
  open (a format, a default, wording, what happens on bad input), so you'd
  have to tell them what you chose, it isn't a quick task: start the
  conversation. Nothing on the never-small list (Size the Work) is a quick
  task, however complete the request.
- **Something non-trivial is missing.** Start the conversation.

## Look Before You Ask

In an existing project, or when they've given you context (a spec, a plan,
a handoff, files they pointed at, earlier conversation), dig in before your
first message. Read what they referred to and the code or material it
connects to, and keep reading until you can explain how the relevant
parts work today and what this change would touch. Never ask what the
project or their context already answers.

## Your First Message

Move the work forward, with one of these:

- **They've already said what they want** (a spec, a plan, a detailed
  request): aim for about 200 words for the whole message. Echo their
  request back in your own words, so they can see whether you've got its
  shape: what they want, who it's for, and why, as far as they've said.
  Add what you found that bears on it: how the relevant parts work today
  and what the change would touch. If you found something they may not
  have considered that would change what they're asking for or how it
  has to be built, like a constraint, a conflict, or a cheaper path, say
  so plainly. How to build it comes later, once you understand what they
  want (see Lay out the approaches). End with one line inviting
  corrections, then one question about what they want: the thing their
  request leaves open whose answer would most change what gets built.
  Specs are often incomplete, so confirm before you build on one.
- **They haven't:** one open question, in their own terms, about the
  biggest thing their request leaves unsettled. Say why you're asking:
  what the answer would change about what you build. For "a website for
  my bakery": "If it's mostly for people deciding whether to stop by,
  I'd lead with hours and what's in the case today; taking orders is a
  different site. What do you want someone to do when they land on it?"

How the message ends depends on whether their message asked for
brainstorming:

- **They asked for it** (by name, by invoking it, or by asking for a
  design discussion): end with your question. They want this
  conversation.
- **They didn't:** they may not want a conversation at all. After your
  question, add a light, one-line offer to just get going instead, like
  "Or if you'd rather I just dive in, say so." If they take you up on
  it, this skill is done: state any significant how-it-gets-made choice
  (platform, language, medium) in one plain line, then do what they
  asked the way its size calls for (Size the Work, below). Their opt-out
  is the approval a small change needs.

That's the whole message.

## The Conversation

Each message ends with one question: a single sentence that asks one
thing, with no list of example answers hanging off it. Anything that
explains the question, like why you're asking, goes before it. Use plain
language, pitched just a little above where your human partner is. Match
their vocabulary; never use process jargon. You never need to quote this
skill to your human partner.

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

**Make every question specific** to their project and what they've told
you. Ask Socratically, the way a sharp colleague would: build each
question on their last answer or on something you found, so it helps
them think through a consequence or a case they may have missed
("Voting closes before the meeting, and two members joined this month.
Does someone who joins mid-round get a vote?"). When the reason isn't
already plain, say what you're hoping to learn or what the answer would
change. A proposal they can correct, plus your reason for it, often
beats a question.

**Offer recon.** Once you have a bit of grounding and looking further
would help, offer to go look: deeper into their codebase or project,
their own files and data, or the web. Say what you'd look for. They
decide whether you go.

**Lay out the approaches.** Once you understand what they want, and
before you write anything up, lay out the ways of building it in the
message that carries your last playback chunk (Play It Back). Come up
with several real alternatives and drop the weak ones, including any
that work against why they want it and any the existing work rules out.
Present the two or three that remain, grounding each in what the project
actually does and saying what it trades off. Recommend one and say why;
that message's one question is which way they want to go. When there's
genuinely one sensible way, say so and explain why the others don't
fit. This is for how it gets built; for what they want, get them
describing first.

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
the approaches (Lay out the approaches) and the size you pick. Its
question is which way to build it; for a small change, it asks whether
to build it that way.

Only what they said goes in as theirs. Anything you filled in goes in
as your proposal, with your reason.

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

1. Run `git status --short` first and note anything that isn't yours. If
   anything is staged (`git diff --cached --quiet` exits non-zero), ask
   before you start: a commit takes the whole index. On the default
   branch or a detached HEAD, start a branch for the change
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
- approaches: the two or three you laid out, what each trades off, which
  one they picked, and why
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
| "I'll offer a menu of what they might want" | Options steer. Ask them to describe it first. |
| "I'll fill in sensible defaults" | Good. Say them out loud. A default they never heard is one they couldn't reject. |
| "I've answered their questions, so I'll write the doc" | Lay out the approaches first, with your last playback chunk. |
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

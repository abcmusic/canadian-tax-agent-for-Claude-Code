# New Feature Pre-Gate — Six Forcing Questions

Read this file when task type = new feature or concept not previously validated.
Purpose: confirm demand reality before engineering effort starts. Prevents building the wrong thing.

---

## Why this matters

Interest ≠ demand. "People said they want it" is not demand. Demand means:
- Someone paid for a workaround
- Someone panics when it breaks
- Someone expanded their usage when a partial version existed

The six questions are designed to surface which category a request falls into, without requiring Barnaby to know the right questions to ask.

---

## The Six Questions

Ask one at a time. Before each question, re-ground: "We're evaluating whether to build [X] for Hinna."

**Q1 — Demand evidence**
"What specific behavior have you seen that proves this is needed — not just that people said they'd use it?"

If answer is vague ("users want it", "I think it would help"): push.
"What did they actually do or pay for to work around the absence of this?"

**Q2 — Workaround cost**
"What's the current workaround, and how much time or money does it cost per week?"

If there's no workaround: "If there's no workaround, what happens today when someone needs this? What do they do instead?"
No workaround sometimes means no real need — or it means the gap is so painful nobody has found a workaround yet. Find out which.

**Q3 — Specific human**
"Name the one person who needs this most urgently right now. Give me their name, role, and what they're trying to accomplish."

Not "businesses" or "studio owners." A real person. Their situation defines the minimum viable scope.
If Barnaby can't name someone: "If you can't name someone specific, how do you know this is the right thing to build next?"

**Q4 — Minimum wedge**
"What's the smallest version of this that person would actually use today — not the full vision, just the 20% that solves 80% of their problem?"

This scopes the work. The answer to Q3 defines the user; Q4 defines what they need right now vs. eventually.

**Q5 — Surprising observation**
"What have you observed or heard that contradicted what you expected about this problem?"

If nothing surprises: "If you haven't been surprised yet, that usually means the assumptions haven't been tested. What would change your mind about building this?"
Comfort signals insufficient depth. Push until something uncomfortable surfaces.

**Q6 — Future fit**
"Will this be more essential to Hinna in 3 years, or less? Why?"

Tests durability. If less essential, is now the right time, or does something more durable deserve the slot?

---

## After the six questions

**Answers are strong** (specific person named, real workaround cost, surprising observation): Proceed to plan. Note which beta criterion this advances.

**Answers are weak** (vague, hypothetical, no specific person): Reflect answers back.

Example: "Based on what you said, this looks like an idea worth validating before building. What would make me proceed immediately: (1) a specific client who tells you they'll expand their account if this exists, OR (2) evidence that the workaround is costing >$500/month across the client base. Without one of those, this goes on the deferred list."

Never reject a feature outright — redirect to the evidence threshold.

---

## Premise Challenge

After the six questions, if answers were mixed — challenge the underlying premise once:

"What if the problem is actually [reframe of the problem]? Would that change what we build?"

Examples:
- Feature request: "notification system" → reframe: "Is the real problem that clients don't know what's coming, or that staff don't have a clear way to communicate it?"
- Feature request: "reporting dashboard" → reframe: "Is the real need a dashboard, or is it Barnaby knowing which number to look at each week?"

One reframe. If Barnaby says the original is right, proceed. Don't push more than once.

---

## Short-circuit conditions

Skip this gate entirely if:
- Bug fix, refactor, or compliance requirement (demand is implicit)
- Barnaby has already answered all six in the current conversation
- The feature was previously validated and is in BETA-TRACKER as a criterion

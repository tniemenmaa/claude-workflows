# Claude Code Development Workflow — Runbook

## Overview

This runbook describes the end-to-end workflow for developing features using Claude Code agents.

**Phases:**
1. Create & refine ticket (manual)
2. Plan ticket (automated workflow)
3. Approve plan (manual)
4. Implement ticket (automated workflow)

## Detailed Flow

### Phase 1: Create & Refine Ticket

**Actor:** You

1. Create a GitHub issue in the target repo with:
   - Clear description of what to build/fix
   - Success criteria (if known)
   - Any constraints or context

2. Open the issue in Claude Code and refine it:
   - Ask clarifying questions
   - Validate the approach
   - Ensure the spec is solid before handing off

**Output:** A well-specified issue ready for agent planning.

---

### Phase 2: Plan Ticket

**Actor:** Planning agent (via `plan-ticket` workflow)

Run the workflow:
```bash
claude-code workflow plan-ticket [issue-number]
```

**What happens:**
- Fetches the GitHub issue
- Planner agent uses `EnterPlanMode` to:
  - Clarify any ambiguities
  - Challenge assumptions
  - Ask you clarifying questions (via the planning mode)
  - Produce a detailed plan covering scope, success criteria, approach

**Output:** A structured plan document that both you and the agent have discussed.

---

### Phase 3: Approve Plan

**Actor:** You

Review the plan output from the planner. Ensure:
- Scope is clear and reasonable
- Success criteria are testable
- Approach makes sense
- No red flags (unproven tech, risky decisions)

**If revisions needed:** Run `plan-ticket` again to re-plan.

**If approved:** Proceed to Phase 4.

---

### Phase 4: Implement Ticket

**Actor:** Development agent (via `implement-ticket` workflow)

Run the workflow:
```bash
claude-code workflow implement-ticket [issue-number]
```

**What happens:**
1. **Develop** — Agent implements based on the approved plan:
   - Reads existing code
   - Implements feature step by step
   - Writes unit & integration tests
   - **If ambiguities arise:** Agent stops and asks you for clarification (blocking)
   - Ensures tests pass

2. **Quality Review** — Agent runs code quality review:
   - Checks for reuse, simplification, efficiency, clarity
   - Returns findings

3. **Rework Loop** — If issues found:
   - Agent fixes issues
   - Re-reviews
   - Repeats up to 5 times
   - If 5 attempts exhausted: surfaces remaining issues to you

4. **PR Creation** — Agent creates a draft PR:
   - Commits code with proper messages
   - Opens PR as draft
   - Ready for your final review

**Output:** A draft PR and branch with working implementation.

---

### Phase 5: Final Review & Merge

**Actor:** You

1. Review the draft PR:
   - Code quality, correctness, testing
   - Security (agent already checked, but you have final say)
   - Any rework cycles that were interrupted

2. If changes needed: Edit code directly or re-run implement-ticket

3. Merge to develop when satisfied

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Planner missed important context | Return to Phase 1, refine issue, re-plan |
| Plan seems wrong | Re-run plan-ticket to iterate with planner |
| Developer got stuck on ambiguity | Answer the agent's question, it will continue |
| Quality review found issues | Let rework loop finish; if max 5 hit, fix manually |
| PR created but tests fail | Check test output, fix code, re-run implement-ticket |

---

## Key Points

- **Plan approval is explicit** — Review the plan before starting development
- **Dev agent prompts you** — It will ask when it needs clarification (blocking)
- **Quality is automated** — Code review and security review run as gates
- **Rework loop handles most issues** — Up to 5 attempts before surfacing to you
- **PR is always draft** — You have final say before merge

---

## Next Steps

1. Create an issue in your project
2. Refine it in Claude Code conversation
3. Run `plan-ticket [issue-number]`
4. Review the plan
5. Run `implement-ticket [issue-number]`
6. Review the PR and merge

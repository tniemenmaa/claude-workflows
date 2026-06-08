# Design: Claude Code Development Workflow & Agent Taxonomy

## Overview

This document outlines the recommended workflow for developing software with Claude Code, including the agent types and skills involved at each phase.

---

## Core Development Phases

### 1. Ticket Creation & Refinement
**Actor:** Developer (you)  
**Goal:** Create a well-specified issue with clear scope and success criteria

**Activities:**
- Write issue in GitHub
- Refine spec with Claude in conversation
- Validate approach and constraints

**Outcome:** Clear, unambiguous issue ready for planning

---

### 2. Planning
**Actor:** Planner Agent (with EnterPlanMode)  
**Goal:** Clarify ambiguities, challenge assumptions, produce detailed plan

**Activities:**
- Fetch issue details
- Clarify scope, success criteria, approach
- Challenge assumptions via interactive planning mode
- Document plan including: goal, success criteria, approach, potential risks, estimated effort

**Skills/Tools:**
- `EnterPlanMode` / `ExitPlanMode` — interactive planning
- GitHub API (via `gh`) — fetch issue details

**Outcome:** Detailed plan approved by developer

---

### 3. Implementation
**Actor:** Developer Agent  
**Goal:** Implement feature following the plan

**Activities:**
- Read and understand existing codebase
- Implement feature step-by-step
- Write unit & integration tests
- Prompt developer for clarifications when needed (blocking)
- Ensure all tests pass

**Skills/Tools:**
- `Read`, `Edit`, `Write` — code manipulation
- `Bash` — run tests, git commands
- `Agent` (subagents) — parallel exploration/reading

**Constraints:**
- Must prompt user for any ambiguities (blocking)
- Must write tests alongside implementation
- Must follow existing code style/conventions

**Outcome:** Working feature with tests, in a feature branch

---

### 4. Quality Review
**Actor:** Quality Review Agent + Security Review Agent  
**Goal:** Find and fix bugs, security issues, and quality problems

**Activities:**

**Code Quality Review:**
- Check for reuse/duplication
- Identify simplification opportunities
- Review efficiency and clarity
- Check for anti-patterns

**Security Review:**
- Validate input handling
- Check auth/privilege logic
- Identify injection vulnerabilities
- Look for data exposure risks

**Skills/Tools:**
- `/code-review` skill — quality analysis
- `/security-review` skill — security analysis

**Rework Loop:**
- Developer agent fixes issues
- Re-review
- Repeat up to 5 times
- If 5 attempts exhausted: surface remaining issues to developer

**Outcome:** Code with no critical issues; developer aware of any remaining concerns

---

### 5. PR & Final Review
**Actor:** Developer (you)  
**Goal:** Final check before merge

**Activities:**
- Review PR: correctness, tests, code quality
- Verify security (agent already checked)
- Approve or request changes

**Outcome:** Merged feature

---

## Agent Types

| Agent | Purpose | Modes | Entry Point |
|-------|---------|-------|-------------|
| **Planner** | Clarify spec, challenge assumptions, produce plan | EnterPlanMode | `plan-ticket` workflow |
| **Developer** | Implement feature per plan, write tests, prompt for clarifications | Normal + blocking prompts | `implement-ticket` workflow |
| **Quality Reviewer** | Find code quality issues | /code-review skill | `implement-ticket` workflow (quality phase) |
| **Security Reviewer** | Find security vulnerabilities | /security-review skill | `implement-ticket` workflow (quality phase) |

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Ticket Creation & Refinement (manual)             │
│ Developer creates issue in GitHub, refines with Claude      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Planning (automated: plan-ticket workflow)        │
│ • Planner agent uses EnterPlanMode                          │
│ • Clarifies ambiguities, challenges assumptions             │
│ • Produces detailed plan                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Developer reviews & approves plan (manual)                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: Implementation (automated: implement-ticket)      │
│ • Developer agent implements feature                        │
│ • Writes tests                                              │
│ • Prompts user if ambiguities (blocking)                   │
│ • Ensures tests pass                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4b: Quality Gate (automated)                          │
│ • Code quality review (quality-review agent)                │
│ • Security review (security-review agent)                   │
│ • Rework loop (up to 5 attempts)                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4c: PR Creation (automated)                           │
│ • Create draft PR                                           │
│ • Commits with proper messages                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: Final Review & Merge (manual)                     │
│ Developer reviews PR, merges when satisfied                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### Why two workflows (plan + implement)?
Separation of concerns. Planning is interactive; developer needs time to review before implementation starts. Splitting allows explicit approval gate.

### Why EnterPlanMode for planning?
Back-and-forth forces thorough thinking and catches issues early. Reduces rework during implementation.

### Why blocking prompts during dev?
Developer agent hits ambiguities you're best placed to answer. Blocking ensures quality answers, not AI guesses.

### Why 5 rework attempts?
Balances autonomy with cost. Most issues fixed within 2-3 attempts; 5 is a safety valve before escalating to you.

### Why auto-create draft PR?
Keeps momentum. Draft prevents accidental merge; you have final say.

---

## Skills & Tools Inventory

### Required Skills
- `EnterPlanMode` / `ExitPlanMode` — interactive planning
- `/code-review` — code quality analysis
- `/security-review` — security analysis

### Required Tools
- `Read`, `Edit`, `Write` — file manipulation
- `Bash` — command execution
- `Agent` — spawn subagents
- `Workflow` — orchestrate phases

### GitHub Integration
- `gh` CLI (via Bash) — fetch issues, create PRs

---

## Future Considerations

- **Team workflows:** Current design assumes solo developer. Could extend to support code review by other team members.
- **Conditional rework:** Smart decision about which issues to fix vs. surface.
- **Caching:** Plans that span multiple tickets could be cached to reduce context.
- **Metrics:** Track plan accuracy, rework cycles, time-to-merge per phase.
- **Integration with Linear/Jira:** Generic issue tracker support, not just GitHub.

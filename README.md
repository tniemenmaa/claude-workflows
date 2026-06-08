# claude-workflows

A repository of agent definitions, workflow scripts, and patterns for developing software with Claude Code.

## Purpose

Establish a reusable, end-to-end workflow for developing features using Claude Code agents. Define agent types, skills, and phases to guide the development process from ticket creation through PR merge.

## Quick Start

1. **Create an issue** in your target repository (GitHub)
2. **Refine the spec** with Claude in conversation
3. **Run the planning workflow:**
   ```bash
   claude-code workflow plan-ticket [issue-number]
   ```
4. **Review the plan** and approve it
5. **Run the implementation workflow:**
   ```bash
   claude-code workflow implement-ticket [issue-number]
   ```
6. **Review and merge** the draft PR

See [RUNBOOK.md](RUNBOOK.md) for detailed step-by-step instructions.

## Contents

- **`plan-ticket.js`** — Workflow: Plan a ticket via interactive planning agent
- **`implement-ticket.js`** — Workflow: Develop, review, and create PR
- **`RUNBOOK.md`** — Step-by-step guide for using the workflows
- **`docs/DESIGN.md`** — Architecture, agent types, and design decisions

## Architecture

**Phases:**
1. Create & refine ticket (manual)
2. Plan (automated: `plan-ticket` workflow)
3. Approve plan (manual)
4. Implement (automated: `implement-ticket` workflow)

**Agents:**
- Planner (uses EnterPlanMode to clarify and challenge)
- Developer (implements per plan, prompts on ambiguities)
- Quality Reviewer (code quality analysis)
- Security Reviewer (security analysis)

**Quality Gates:**
- Code quality review (via `/code-review` skill)
- Security review (via `/security-review` skill)
- Rework loop (up to 5 attempts) before surfacing issues

See [docs/DESIGN.md](docs/DESIGN.md) for full architecture.

## Key Features

✓ **Interactive planning** — EnterPlanMode for thorough spec clarification  
✓ **Blocking prompts** — Developer agent asks you when it hits ambiguities  
✓ **Automated quality gates** — Code quality & security review built-in  
✓ **Smart rework loop** — Automatic fixing up to 5 attempts  
✓ **Draft PR** — Auto-creates draft PR, you control merge  

## Future

This repository is a living project. As you develop, you'll:
- Collect reusable agent prompts and configurations
- Document patterns that work well
- Refine the workflow based on experience
- Consider extension to team workflows, CI/CD integration, etc.

## Related

- Issue #1: Design developer workflow & agent taxonomy (MVP)

## Contributing

This is your personal repo. Update as you learn what works.

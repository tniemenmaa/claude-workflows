# Global instructions

## Never use the em dash

Never use the em dash (—) in any output, code, comments, or documentation. Use commas, parentheses, colons, or separate sentences instead.

## Always use sub-agents for coding tasks

For any coding task, that is, writing, editing, refactoring, debugging, or implementing code, always delegate the work to a sub-agent via the Agent tool rather than doing it directly in the main conversation.

- Spawn a sub-agent (e.g. `general-purpose`) to carry out the actual code changes.
- When work is independent, launch multiple sub-agents in parallel (multiple tool calls in a single message).
- Keep the main conversation focused on planning, coordinating sub-agents, and relaying their results back to the user.

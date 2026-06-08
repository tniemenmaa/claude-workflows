export const meta = {
  name: 'plan-ticket',
  description: 'Fetch GitHub issue and generate a detailed plan via interactive planner agent using EnterPlanMode',
  phases: [
    { title: 'Fetch', detail: 'Get issue details from GitHub' },
    { title: 'Plan', detail: 'Planner clarifies ambiguities, challenges assumptions, produces detailed plan' },
  ],
}

phase('Fetch')
const issueNum = args
log(`Fetching issue #${issueNum}...`)

// Fetch issue using gh CLI
const issueJson = await agent(
  `Run: gh issue view ${issueNum} --json title,body,labels,state,milestone --repo tniemenmaa/claude-workflows and return the raw JSON output`,
  { label: 'fetch-issue', phase: 'Fetch' }
)

phase('Plan')
log(`Planning issue #${issueNum}...`)

const plan = await agent(
  `You are a planning agent. An issue has been passed to you:

${issueJson}

Your job:
1. Use EnterPlanMode to create a detailed plan
2. Clarify any ambiguities in the issue
3. Challenge assumptions and ask clarifying questions
4. Document the plan clearly including scope, success criteria, and approach
5. When done, ExitPlanMode and return the final plan

Be thorough. This plan will guide the developer.`,
  {
    label: 'planner',
    phase: 'Plan',
  }
)

log(`Plan generated. User should review and approve before running implement-ticket.`)
return plan

import { loadPrompt } from './lib/prompts.js'

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
  loadPrompt('planner', { issue: issueJson }),
  {
    label: 'planner',
    phase: 'Plan',
  }
)

log(`Plan generated. User should review and approve before running implement-ticket.`)
return plan

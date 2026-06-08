import { loadPrompt } from './lib/prompts.js'

export const meta = {
  name: 'implement-ticket',
  description: 'Develop feature from approved plan: implement, quality review, security review with rework loop, then create PR draft',
  phases: [
    { title: 'Fetch', detail: 'Get issue and approved plan' },
    { title: 'Develop', detail: 'Developer implements feature, prompts user for clarifications' },
    { title: 'Review', detail: 'Code quality and security review' },
    { title: 'Rework', detail: 'Fix issues found in review (max 5 attempts)' },
    { title: 'PR', detail: 'Create PR as draft' },
  ],
}

phase('Fetch')
const issueNum = args
log(`Fetching issue #${issueNum}...`)

const issueJson = await agent(
  `Run: gh issue view ${issueNum} --json title,body,labels,state,milestone --repo tniemenmaa/claude-workflows and return the raw JSON output`,
  { label: 'fetch-issue', phase: 'Fetch' }
)

log(`Fetched. Ensure you have reviewed and approved the plan before proceeding.`)

phase('Develop')
log(`Starting development...`)

const developed = await agent(
  loadPrompt('developer', { issue: issueJson }),
  { label: 'developer', phase: 'Develop' }
)

phase('Review')
let reworkCount = 0
let currentCode = developed
let hasIssues = true

while (hasIssues && reworkCount < 5) {
  log(`Quality review cycle ${reworkCount + 1}/5...`)

  const qualityReview = await agent(
    loadPrompt('quality-review'),
    { label: `quality-review-${reworkCount + 1}`, phase: 'Review' }
  )

  const securityReview = await agent(
    loadPrompt('security-review'),
    { label: `security-review-${reworkCount + 1}`, phase: 'Review' }
  )

  if (!qualityReview && !securityReview) {
    hasIssues = false
    log(`No issues found. Code is ready.`)
    break
  }

  if (qualityReview || securityReview) {
    reworkCount++
    if (reworkCount < 5) {
      log(`Issues found. Reworking (attempt ${reworkCount}/5)...`)
      currentCode = await agent(
        loadPrompt('rework', { quality: qualityReview, security: securityReview }),
        { label: `rework-${reworkCount}`, phase: 'Rework' }
      )
    } else {
      log(`Max rework attempts (5) reached. Surfacing remaining issues to user.`)
      hasIssues = false
    }
  }
}

phase('PR')
log(`Creating PR as draft...`)

const pr = await agent(
  loadPrompt('create-pr'),
  { label: 'create-pr', phase: 'PR' }
)

log(`PR created as draft. Ready for user review.`)
return { issue: issueNum, pr, reworkCount }

import type { RawEmail, TriageResult } from "@/lib/types"

export type ScriptedMail = RawEmail & {
  triage: TriageResult
}

export const DEMO_ACCOUNT = "pavel@lab.edu"

export const INITIAL_MAIL: ScriptedMail[] = [
  {
    fromName: "Anna Kowalska",
    fromEmail: "anna.kowalska@lab.edu",
    subject: "NeurIPS draft — comments by Thursday?",
    account: DEMO_ACCOUNT,
    body: "Pavel, I pushed section 4 and the new ablation table. Could you read the method and tell me if the claim in 4.2 is too strong? I still need two figures. Thursday 18:00 CET is the internal freeze before we upload.",
    triage: {
      priority: "action",
      summary:
        "Anna needs your comments on the NeurIPS method section by Thursday 18:00 CET. Two figures are still missing.",
      why: "A coauthor is blocked on your read before a hard freeze.",
      suggestedAction: "Open the letter, skim 4.2, reply with yes / too strong + one sentence.",
    },
  },
  {
    fromName: "Google",
    fromEmail: "no-reply@accounts.google.com",
    subject: "Security alert: new sign-in on Mac",
    account: DEMO_ACCOUNT,
    body: "A new sign-in to your Google Account was detected from Chrome on a Mac in Berlin. If this was you, you can ignore this. If not, review your devices now.",
    triage: {
      priority: "urgent",
      summary:
        "New Google sign-in from Chrome on a Mac in Berlin. Confirm it was you or lock the account.",
      why: "Account takeover mail. Cheap to check, expensive to ignore.",
      suggestedAction: "Open the alert. If it was not you, revoke the session from the letter.",
    },
  },
  {
    fromName: "arXiv cs.LG",
    fromEmail: "no-reply@arxiv.org",
    subject: "cs.LG daily digest",
    account: DEMO_ACCOUNT,
    body: "Your daily digest is ready. 86 new papers in cs.LG. Unsubscribe at any time.",
    triage: {
      priority: "noise",
      summary: "arXiv dumped 86 cs.LG papers. Clerk kept this off your phone.",
      why: "Recurring digest. Nobody is waiting.",
      suggestedAction: "Ignore unless you asked for a digest today.",
    },
  },
  {
    fromName: "NSF FastLane",
    fromEmail: "notifications@research.gov",
    subject: "Proposal 24-8812 received",
    account: DEMO_ACCOUNT,
    body: "Your proposal “Adaptive tools for live scientific reading” has been received. No action is required. You will be notified when reviews are assigned.",
    triage: {
      priority: "fyi",
      summary:
        "NSF received proposal 24-8812. No action required until reviews are assigned.",
      why: "Receipt confirmation, not a request.",
      suggestedAction: "File it mentally. No reply.",
    },
  },
]

export const ARRIVAL_QUEUE: ScriptedMail[] = [
  {
    fromName: "Elena Varga",
    fromEmail: "elena.varga@institute.eu",
    subject: "Grant budget revision due Monday",
    account: DEMO_ACCOUNT,
    body: "Hi Pavel, the institute flagged personnel costs on the ERC annex. I need your corrected table by Monday 10:00. Can you send the updated spreadsheet today if possible?",
    triage: {
      priority: "action",
      summary:
        "Elena needs the ERC personnel table corrected by Monday 10:00 — today if you can.",
      why: "Admin deadline with your name on the annex.",
      suggestedAction: "Open, grab the spreadsheet, send the fix or a when-you-can note.",
    },
  },
  {
    fromName: "Lufthansa",
    fromEmail: "noreply@lufthansa.com",
    subject: "Flight LH1926 tomorrow — departure moved to 16:40",
    account: DEMO_ACCOUNT,
    body: "Your flight LH1926 from Berlin to Munich tomorrow is retimed. New departure 16:40, new gate posted in the app. Check-in remains open.",
    triage: {
      priority: "urgent",
      summary:
        "Tomorrow’s LH1926 Berlin → Munich moved to 16:40. Gate is in the airline app.",
      why: "Travel change for a flight already on the calendar.",
      suggestedAction: "Open the letter, shift the calendar block, tell whoever picks you up.",
    },
  },
  {
    fromName: "Marta (PhD)",
    fromEmail: "marta@lab.edu",
    subject: "Can we move Friday’s 1:1?",
    account: DEMO_ACCOUNT,
    body: "Hi Pavel, the MRI slot collided with our Friday 1:1. Could we do Thursday 11:30 instead? I can also do Monday. Thanks — Marta",
    triage: {
      priority: "action",
      summary:
        "Marta wants to move Friday’s 1:1 to Thursday 11:30 (or Monday) because of an MRI slot.",
      why: "A student is waiting on a calendar yes/no.",
      suggestedAction: "Pick a slot and reply. Thirty seconds.",
    },
  },
  {
    fromName: "LinkedIn",
    fromEmail: "messages-noreply@linkedin.com",
    subject: "You appeared in 8 searches this week",
    account: DEMO_ACCOUNT,
    body: "People are looking at your profile. See who viewed your profile. Unsubscribe from these emails.",
    triage: {
      priority: "noise",
      summary: "LinkedIn wants you to open the app. Clerk did not knock.",
      why: "Growth mail with an unsubscribe footer.",
      suggestedAction: "Leave it.",
    },
  },
  {
    fromName: "ICML 2026",
    fromEmail: "reviews@icml.cc",
    subject: "Review request: paper 4412 due in 10 days",
    account: DEMO_ACCOUNT,
    body: "Dear Pavel, you have been invited to review paper 4412. Please accept or decline within 72 hours. The review itself is due in 10 days.",
    triage: {
      priority: "action",
      summary:
        "ICML invited you to review paper 4412. Accept or decline within 72 hours; review due in 10 days.",
      why: "Conference systems escalate if you stay silent.",
      suggestedAction: "Open, glance at the title, accept or decline from the letter.",
    },
  },
  {
    fromName: "Journal of Experimental Science",
    fromEmail: "editor@jexpsci.org",
    subject: "Minor revision requested — MS-2026-118",
    account: DEMO_ACCOUNT,
    body: "Dear Dr. Didin, reviewers are positive. Please address the three minor comments and return the manuscript within 21 days. Track-changes preferred.",
    triage: {
      priority: "action",
      summary:
        "J. Exp. Sci. wants a minor revision of MS-2026-118 in 21 days. Reviewers are positive.",
      why: "A journal is waiting on you, but not today.",
      suggestedAction: "Open, calendar the 21-day mark, reply only if you need extra time.",
    },
  },
  {
    fromName: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "[dependabot] Bump next from 16.3.4 to 16.3.5",
    account: DEMO_ACCOUNT,
    body: "Dependabot opened a pull request on letterdesk. Unsubscribe from this repository.",
    triage: {
      priority: "noise",
      summary: "Dependabot opened a bump PR. Not a person.",
      why: "Automated repo mail.",
      suggestedAction: "Ignore unless you are mid-release.",
    },
  },
  {
    fromName: "Lab manager",
    fromEmail: "ops@lab.edu",
    subject: "Coffee machine is back",
    account: DEMO_ACCOUNT,
    body: "The second-floor machine is repaired. Filters restocked. No action needed — just so you stop asking.",
    triage: {
      priority: "fyi",
      summary: "Second-floor coffee machine is repaired. No action.",
      why: "Lab life, not a blocker.",
      suggestedAction: "Smile. Do not reply-all.",
    },
  },
]

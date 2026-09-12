# Unit: Evaluation

## Purpose
Save student evaluation drafts and submit valid evaluations before the deadline.

## Responsibilities
- Save and update draft scores for assigned pairs.
- Submit evaluations and record submission time.
- Enforce deadline rules on the server.
- Support confirmed incomplete submissions for partial credit.
- Return the student's evaluation and submission status.

## NOT Responsible For
- Generating or reassigning pairs.
- Creating Assignment criteria or changing group membership.
- Calculating final reports and score summaries.

## Dependencies
- Depends on: Pair Assignment data, Assignment deadline data, and authenticated user data.
- Used by: Student API Routes and Reporting Service.

## Key Business Rules
- Only the student assigned to a pair can save or submit its response.
- Drafts may be incomplete and can be updated.
- The server rejects submissions after the deadline.
- Incomplete submission requires `confirmIncomplete: true`.
- Submitted responses cannot be edited in this Lab MVP.

## Key Stories
- US-04 — Student saves evaluation progress as a draft.
- US-05 — Student submits an evaluation.
- US-06 — Student views submission status.

## Bolt Type
[x] DDD Construction — evaluation contains deadline and submission rules.
[ ] Simple Construction
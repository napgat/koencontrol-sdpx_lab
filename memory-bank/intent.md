# Intent: PairEval Group Evaluation Service

## Intent Statement
Enable instructors to run fair group evaluations through pairwise comparison.
Students receive only assigned group pairs, save draft responses, and submit
evaluations before the deadline.

## Business Context
- **Problem:** Group evaluation is difficult to manage manually and may be unfair
  if students evaluate their own group or if pair assignments are unclear.
- **Users:** Instructors who create and monitor evaluations; students who evaluate
  assigned group pairs.
- **Value:** A clear, controlled evaluation workflow with access control, deadline
  enforcement, and traceable results.

## Success Criteria
- [ ] An instructor can create an Assignment with criteria totaling 100%.
- [ ] A student cannot receive a pair containing their own group.
- [ ] A student can save a draft and submit before the server-enforced deadline.
- [ ] An instructor can view group score summaries and pair coverage.

## Decisions Already Made
- Lab 02 scope covers Group Evaluation only.
- The API uses REST endpoints with bearer-token authentication.
- The server, not the client, validates deadlines and authorization.
- Incomplete submissions are allowed only after student confirmation and are used
  for partial-credit calculation.
- Submitted responses cannot be edited in this Lab MVP.
- Pair assignment must prevent self-evaluation.

## Out of Scope
- Individual evaluation between group members.
- Re-submission after submit.
- Changing student groups and re-generating existing pairs.
- CSV and Excel report export.
- Instructor manually evaluating pairs.

## Status
In Progress — WS-02
# Unit: Pairing

## Purpose
Generate and assign fair group-evaluation pairs for each criterion.

## Responsibilities
- Generate group comparison pairs for an Assignment.
- Assign pairs only to eligible students.
- Prevent a student from evaluating a pair containing their own group.
- Prevent duplicate pair generation for the same Assignment.

## NOT Responsible For
- Creating Assignment titles, deadlines, or criteria.
- Saving draft responses or submitting evaluations.
- Calculating final group scores.

## Dependencies
- Depends on: Assignment data, group membership data, and authenticated user data.
- Used by: Assignment API Routes and Evaluation Service.

## Key Business Rules
- A student must never receive a pair containing their own group.
- Pairs are generated separately for each criterion.
- Pair generation requires at least three groups.
- A generated Assignment cannot create duplicate pair assignments.

## Key Stories
- US-02 — System generates fair group-evaluation pairs.
- US-03 — Student views assigned evaluation pairs.
- US-08 — Instructor views assignment readiness.

## Bolt Type
[x] DDD Construction — pair generation contains domain rules about fairness.
[ ] Simple Construction
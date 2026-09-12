# OpenAPI Review Checklist — PairEval

Use this checklist after `docs/openapi.yaml` passes Redocly lint. Mark an item
as complete only after verifying it in the YAML file.

## Global Checks

- [x] The OpenAPI file contains only the eight endpoints in `api-traceability.md`.
- [x] Every endpoint has an `x-user-story` value.
- [x] Every user story from US-01 through US-08 has an endpoint.
- [x] All protected operations use the bearer-token security requirement.
- [x] Every error response uses the same `Error` schema.

## Endpoint Checklist

| Endpoint | User Story | Method / success status | Relevant errors | Required request fields | Authentication | Consistent Error schema | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `POST /assignments` | US-01 | ✅ | ✅ | ✅ | ✅ | ✅ | Complete |
| `POST /assignments/{assignmentId}/pair-assignments/generate` | US-02 | ✅ | ✅ | N/A | ✅ | ✅ | Complete |
| `GET /assignments/{assignmentId}/my-pairs` | US-03 | ✅ | ✅ | N/A | ✅ | ✅ | Complete |
| `PUT /pair-assignments/{pairAssignmentId}/response` | US-04 | ✅ | ✅ | ✅ | ✅ | ✅ | Complete |
| `POST /assignments/{assignmentId}/submit` | US-05 | ✅ | ✅ | ✅ | ✅ | ✅ | Complete with note |
| `GET /assignments/{assignmentId}/my-submission` | US-06 | ✅ | ✅ | N/A | ✅ | ✅ | Complete |
| `GET /assignments/{assignmentId}/report` | US-07 | ✅ | ✅ | N/A | ✅ | ✅ | Complete |
| `GET /assignments/{assignmentId}` | US-08 | ✅ | ✅ | N/A | ✅ | ✅ | Complete |

## How to Review Each Endpoint

1. Compare the endpoint with its User Story and Acceptance Criteria in
   `product-backlog.md`.
2. Confirm that `x-user-story` points to the correct story.
3. Confirm that the HTTP method and success status match the operation.
   A `POST` that creates a resource must return `201` and a resource body.
4. Check appropriate error responses, such as `401`, `403`, `404`, `409`, or
   `422`. Do not require irrelevant status codes.
5. For request bodies, follow the referenced schema and confirm every
   indispensable field appears in `required`.
6. Confirm bearer-token authentication is required.
7. Confirm each error response references the shared `Error` schema.

## Review Notes

Record corrections or decisions here before changing `openapi.yaml`.

- `SubmissionStatus.submittedAt` should be required and non-null for the successful submitted-state response. The current shared schema permits it to be omitted, which does not fully guarantee the timestamp required by US-05 and US-06.

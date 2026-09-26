import {
  createLab07Draft,
  getLab07Assignment,
  lab07LocalTestEnabled,
} from "@/lib/lab07-test-store";
import { logger } from "@/lib/logger";
import { withRequestLogging } from "@/lib/request-logging";
import {
  lab07PreviewEnabled,
  lab07PreviewWriteAuthorized,
} from "@/lib/lab07-preview-access";
import {
  createLab07PreviewDraft,
  type PreviewDraftInput,
} from "@/lib/lab07-preview-store";

export async function POST(request: Request) {
  return withRequestLogging(
    request,
    "/api/lab-07/evaluation-drafts",
    async (requestId) => {
      const local = lab07LocalTestEnabled();
      const preview = lab07PreviewEnabled();
      if (!local && !preview) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      if (preview && !lab07PreviewWriteAuthorized(request)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const body: unknown = await request.json().catch(() => null);
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        logger.warn({
          event: "evaluation_draft_failed",
          requestId,
          reason: "invalid_json",
        });
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
      }

      const data = body as Record<string, unknown>;
      if (
        typeof data.assignmentId !== "string" ||
        typeof data.pairId !== "string" ||
        (data.choice !== "A" &&
          data.choice !== "B" &&
          data.choice !== "equal") ||
        typeof data.runId !== "string" ||
        !/^[A-Za-z0-9_-]{1,64}$/.test(data.runId)
      ) {
        logger.warn({
          event: "evaluation_draft_failed",
          requestId,
          reason: "invalid_draft",
        });
        return Response.json({ error: "Invalid draft" }, { status: 400 });
      }
      const assignment = getLab07Assignment(data.assignmentId);
      if (!assignment || !assignment.pairs.some((pair) => pair.id === data.pairId)) {
        return Response.json({ error: "Pair not found" }, { status: 404 });
      }

      const saveStart = performance.now();
      const input: PreviewDraftInput = {
        assignmentId: data.assignmentId,
        pairId: data.pairId,
        choice: data.choice,
        runId: data.runId,
      };
      const result = preview
        ? await createLab07PreviewDraft(input)
        : createLab07Draft(input);

      if (result === "not-found") {
        logger.warn({
          event: "evaluation_draft_failed",
          requestId,
          reason: "pair_not_found",
        });
        return Response.json({ error: "Pair not found" }, { status: 404 });
      }

      if (result === "full") {
        logger.warn({
          event: "evaluation_draft_failed",
          requestId,
          reason: "store_full",
        });
        return Response.json({ error: "Test store is full" }, { status: 429 });
      }

      logger.info({
        event: "evaluation_draft_created",
        requestId,
        draftId: result.id,
        runId: result.runId,
        duration_ms: Number((performance.now() - saveStart).toFixed(2)),
      });

      return Response.json(result, { status: 201 });
    },
  );
}
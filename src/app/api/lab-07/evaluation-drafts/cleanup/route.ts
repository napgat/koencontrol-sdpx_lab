import {
  lab07PreviewEnabled,
  lab07PreviewWriteAuthorized,
} from "@/lib/lab07-preview-access";
import { deleteLab07PreviewRun } from "@/lib/lab07-preview-store";
import { logger } from "@/lib/logger";
import { withRequestLogging } from "@/lib/request-logging";

export async function POST(request: Request) {
  return withRequestLogging(
    request,
    "/api/lab-07/evaluation-drafts/cleanup",
    async (requestId) => {
      if (!lab07PreviewEnabled()) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      if (!lab07PreviewWriteAuthorized(request)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body: unknown = await request.json().catch(() => null);
      if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
      }

      const { runId } = body as Record<string, unknown>;
      if (typeof runId !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(runId)) {
        return Response.json({ error: "Invalid run ID" }, { status: 400 });
      }

      const deletedCount = await deleteLab07PreviewRun(runId);
      logger.info({
        event: "lab07_preview_run_cleaned",
        requestId,
        runId,
        deletedCount,
      });

      return Response.json({ runId, deletedCount });
    },
  );
}

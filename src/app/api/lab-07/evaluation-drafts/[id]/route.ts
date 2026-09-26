import {
  getLab07Draft,
  lab07LocalTestEnabled,
} from "@/lib/lab07-test-store";
import { lab07PreviewEnabled } from "@/lib/lab07-preview-access";
import { getLab07PreviewDraft } from "@/lib/lab07-preview-store";
import { withRequestLogging } from "@/lib/request-logging";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return withRequestLogging(
    request,
    "/api/lab-07/evaluation-drafts/[id]",
    async () => {
      const local = lab07LocalTestEnabled();
      const preview = lab07PreviewEnabled();
      if (!local && !preview) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const { id } = await context.params;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const draft = preview
        ? await getLab07PreviewDraft(id)
        : getLab07Draft(id);

      if (!draft) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json(draft);
    },
  );
}

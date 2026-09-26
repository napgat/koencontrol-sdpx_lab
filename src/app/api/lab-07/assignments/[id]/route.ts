import {
  getLab07Assignment,
  lab07LocalTestEnabled,
} from "@/lib/lab07-test-store";
import { withRequestLogging } from "@/lib/request-logging";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  return withRequestLogging(
    request,
    "/api/lab-07/assignments/[id]",
    async () => {
      if (!lab07LocalTestEnabled()) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      const { id } = await context.params;
      const assignment = getLab07Assignment(id);

      if (!assignment) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }

      return Response.json(assignment);
    },
  );
}
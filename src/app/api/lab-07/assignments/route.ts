import {
  lab07LocalTestEnabled,
  listLab07Assignments,
} from "@/lib/lab07-test-store";
import { lab07PreviewEnabled } from "@/lib/lab07-preview-access";
import { withRequestLogging } from "@/lib/request-logging";

export async function GET(request: Request) {
  return withRequestLogging(request, "/api/lab-07/assignments", () => {
    if (!lab07LocalTestEnabled() && !lab07PreviewEnabled()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(listLab07Assignments());
  });
}
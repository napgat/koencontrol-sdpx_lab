import {
  lab07LocalTestEnabled,
  listLab07Assignments,
} from "@/lib/lab07-test-store";
import { withRequestLogging } from "@/lib/request-logging";

export async function GET(request: Request) {
  return withRequestLogging(request, "/api/lab-07/assignments", () => {
    if (!lab07LocalTestEnabled()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(listLab07Assignments());
  });
}
import { randomUUID } from "node:crypto";
import { logger } from "@/lib/logger";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function withRequestLogging(
  request: Request,
  routePattern: string,
  handler: (requestId: string) => Response | Promise<Response>,
): Promise<Response> {
  const incomingId = request.headers.get("x-request-id");
  const requestId =
    incomingId && uuidPattern.test(incomingId) ? incomingId : randomUUID();
  const start = performance.now();

  let response: Response;
  try {
    response = await handler(requestId);
  } catch (error) {
    logger.error({
      event: "request_handler_failed",
      requestId,
      reason: error instanceof Error ? error.name : "unknown",
    });
    response = Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  response.headers.set("x-request-id", requestId);
  logger.info({
    event: "http_request",
    requestId,
    method: request.method,
    path: routePattern,
    statusCode: response.status,
    duration_ms: Number((performance.now() - start).toFixed(2)),
  });

  return response;
}
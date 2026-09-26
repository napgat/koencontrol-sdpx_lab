import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { lab07PreviewEnabled } from "@/lib/lab07-preview-access";

export type PreviewDraftInput = {
  assignmentId: string;
  pairId: string;
  choice: "A" | "B" | "equal";
  runId: string;
};

export type PreviewDraft = PreviewDraftInput & {
  id: string;
  createdAt: string;
};

export async function createLab07PreviewDraft(
  input: PreviewDraftInput,
): Promise<PreviewDraft> {
  if (!lab07PreviewEnabled()) {
    throw new Error("Lab 07 Preview is unavailable");
  }

  const databaseUrl = process.env.LAB07_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Lab 07 database is not configured");
  }

  const draft: PreviewDraft = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const sql = neon(databaseUrl);
  await sql`
    INSERT INTO lab07_evaluation_drafts
      (id, assignment_id, pair_id, choice, run_id, created_at)
    VALUES
      (${draft.id}::uuid, ${draft.assignmentId}, ${draft.pairId},
       ${draft.choice}, ${draft.runId}, ${draft.createdAt}::timestamptz)
  `;

  return draft;
}

export async function getLab07PreviewDraft(
  id: string,
): Promise<PreviewDraft | null> {
  if (!lab07PreviewEnabled()) {
    throw new Error("Lab 07 Preview is unavailable");
  }

  const databaseUrl = process.env.LAB07_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Lab 07 database is not configured");
  }

  const sql = neon(databaseUrl);
  const rows = await sql`
    SELECT
      id::text AS id,
      assignment_id AS "assignmentId",
      pair_id AS "pairId",
      choice,
      run_id AS "runId",
      to_char(
        created_at AT TIME ZONE 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
      ) AS "createdAt"
    FROM lab07_evaluation_drafts
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  return (rows[0] as PreviewDraft | undefined) ?? null;
}


export async function deleteLab07PreviewRun(runId: string): Promise<number> {
  if (!lab07PreviewEnabled()) {
    throw new Error("Lab 07 Preview is unavailable");
  }
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(runId)) {
    throw new Error("Invalid run ID");
  }

  const databaseUrl = process.env.LAB07_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Lab 07 database is not configured");
  }

  const sql = neon(databaseUrl);
  const deleted = await sql`
    DELETE FROM lab07_evaluation_drafts
    WHERE run_id = ${runId}
    RETURNING id
  `;
  return deleted.length;
}
CREATE TABLE IF NOT EXISTS lab07_evaluation_drafts (
  id uuid PRIMARY KEY,
  assignment_id text NOT NULL,
  pair_id text NOT NULL,
  choice text NOT NULL CHECK (choice IN ('A', 'B', 'equal')),
  run_id text NOT NULL CHECK (run_id ~ '^[A-Za-z0-9_-]{1,64}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lab07_evaluation_drafts_run_id_idx
  ON lab07_evaluation_drafts (run_id);
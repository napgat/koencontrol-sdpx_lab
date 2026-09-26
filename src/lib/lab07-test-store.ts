import { randomUUID } from "node:crypto";
import type {
  PairAssignment,
  PairAssignmentRepository,
} from "@/repositories/pair-assignment-repository";
import { PairingService } from "@/services/pairing-service";

class LocalRepository implements PairAssignmentRepository {
  private readonly items: PairAssignment[] = [];

  findByAssignmentId(id: string): PairAssignment[] {
    return this.items.filter((item) => item.assignmentId === id);
  }

  saveMany(items: PairAssignment[]): PairAssignment[] {
    this.items.push(...items);
    return items;
  }
}

const assignment = {
  id: "lab07-assignment-1",
  title: "Lab 07 group evaluation",
};

const pairs = new PairingService(new LocalRepository())
  .generatePairAssignments({
    assignmentId: assignment.id,
    groups: [{ id: "group-a" }, { id: "group-b" }, { id: "group-c" }],
    criteria: [{ id: "criterion-quality", name: "Quality" }],
    evaluators: [
      { id: "student-a", groupId: "group-a" },
      { id: "student-b", groupId: "group-b" },
      { id: "student-c", groupId: "group-c" },
    ],
  })
  .map((pair, index) => ({ id: `lab07-pair-${index + 1}`, ...pair }));

type DraftInput = {
  assignmentId: string;
  pairId: string;
  choice: "A" | "B" | "equal";
  runId: string;
};

type Draft = DraftInput & { id: string; createdAt: string };

const holder = globalThis as typeof globalThis & {
  __lab07Drafts?: Map<string, Draft>;
};
const drafts = (holder.__lab07Drafts ??= new Map<string, Draft>());

export function lab07LocalTestEnabled(): boolean {
  return (
    process.env.LAB07_TEST_MODE === "true" &&
    process.env.NODE_ENV === "development"
  );
}

export function listLab07Assignments() {
  return [assignment];
}

export function getLab07Assignment(id: string) {
  return id === assignment.id ? { ...assignment, pairs } : null;
}

export function createLab07Draft(
  input: DraftInput,
): Draft | "not-found" | "full" {
  if (
    input.assignmentId !== assignment.id ||
    !pairs.some((pair) => pair.id === input.pairId)
  ) {
    return "not-found";
  }

  if (drafts.size >= 1000) {
    return "full";
  }

  const draft = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  drafts.set(draft.id, draft);
  return draft;
}

export function getLab07Draft(id: string): Draft | null {
  return drafts.get(id) ?? null;
}
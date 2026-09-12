import type {
  PairAssignment,
  PairAssignmentRepository,
} from "../repositories/pair-assignment-repository";

export type Group = {
  id: string;
};

export type Student = {
  id: string;
  groupId: string;
};

export type Criterion = {
  id: string;
  name: string;
};

export type PairingRequest = {
  assignmentId: string;
  groups: Group[];
  criteria: Criterion[];
  evaluators: Student[];
};

export class PairingRuleError extends Error {}

export class PairingService {
  constructor(private readonly repository: PairAssignmentRepository) {}

  generatePairAssignments(request: PairingRequest): PairAssignment[] {
    if (request.groups.length < 3) {
      throw new PairingRuleError(
        "Pair generation requires at least three groups.",
      );
    }

    if (this.repository.findByAssignmentId(request.assignmentId).length > 0) {
      throw new PairingRuleError(
        "Pair assignments have already been generated for this assignment.",
      );
    }

    const assignments: PairAssignment[] = [];

    for (const criterion of request.criteria) {
      for (let firstIndex = 0; firstIndex < request.groups.length; firstIndex++) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < request.groups.length;
          secondIndex++
        ) {
          const groupA = request.groups[firstIndex];
          const groupB = request.groups[secondIndex];
          const evaluator = request.evaluators.find(
            (student) =>
              student.groupId !== groupA.id && student.groupId !== groupB.id,
            // student.groupId !== groupB.id,
          );

          if (!evaluator) {
            throw new PairingRuleError(
              "No eligible evaluator exists for this pair.",
            );
          }

          assignments.push({
            assignmentId: request.assignmentId,
            criterionId: criterion.id,
            evaluatorStudentId: evaluator.id,
            groupAId: groupA.id,
            groupBId: groupB.id,
          });
        }
      }
    }

    return this.repository.saveMany(assignments);
  }
}

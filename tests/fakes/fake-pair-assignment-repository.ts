import type {
  PairAssignment,
  PairAssignmentRepository,
} from "../../src/repositories/pair-assignment-repository";

export class FakePairAssignmentRepository
  implements PairAssignmentRepository
{
  private assignments: PairAssignment[];

  constructor(initialAssignments: PairAssignment[] = []) {
    this.assignments = [...initialAssignments];
  }

  findByAssignmentId(assignmentId: string): PairAssignment[] {
    return this.assignments.filter(
      (assignment) => assignment.assignmentId === assignmentId,
    );
  }

  saveMany(assignments: PairAssignment[]): PairAssignment[] {
    this.assignments.push(...assignments);
    return assignments;
  }
}
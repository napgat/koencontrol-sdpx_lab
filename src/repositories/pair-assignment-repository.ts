export type PairAssignment = {
  assignmentId: string;
  criterionId: string;
  evaluatorStudentId: string;
  groupAId: string;
  groupBId: string;
};

export interface PairAssignmentRepository {
  findByAssignmentId(assignmentId: string): PairAssignment[];
  saveMany(assignments: PairAssignment[]): PairAssignment[];
}
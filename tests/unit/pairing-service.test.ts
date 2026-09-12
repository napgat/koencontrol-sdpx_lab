import { describe, expect, it } from "vitest";

import { FakePairAssignmentRepository } from "../fakes/fake-pair-assignment-repository";
import {
  PairingRuleError,
  PairingService,
} from "../../src/services/pairing-service";
import {
  makeAssignment,
  makeCriterion,
  makeGroup,
  makeStudent,
} from "../factories";

describe("PairingService.generatePairAssignments", () => {
  it("rejects pairing when there are fewer than three groups", () => {
    const repository = new FakePairAssignmentRepository();
    const service = new PairingService(repository);
    const assignment = makeAssignment();
    const groups = [
      makeGroup({ id: "group-a" }),
      makeGroup({ id: "group-b" }),
    ];

    expect(() =>
      service.generatePairAssignments({
        assignmentId: assignment.id,
        groups,
        criteria: [makeCriterion()],
        evaluators: [
          makeStudent({ id: "student-a", groupId: "group-a" }),
          makeStudent({ id: "student-b", groupId: "group-b" }),
        ],
      }),
    ).toThrow(PairingRuleError);
  });

  it("creates pair assignments separately for each criterion", () => {
    const repository = new FakePairAssignmentRepository();
    const service = new PairingService(repository);
    const assignment = makeAssignment();
    const groups = [
      makeGroup({ id: "group-a" }),
      makeGroup({ id: "group-b" }),
      makeGroup({ id: "group-c" }),
    ];
    const criteria = [
      makeCriterion({ id: "criterion-technical" }),
      makeCriterion({ id: "criterion-presentation" }),
    ];

    const assignments = service.generatePairAssignments({
      assignmentId: assignment.id,
      groups,
      criteria,
      evaluators: [
        makeStudent({ id: "student-a", groupId: "group-a" }),
        makeStudent({ id: "student-b", groupId: "group-b" }),
        makeStudent({ id: "student-c", groupId: "group-c" }),
      ],
    });

    expect(assignments).toHaveLength(6);

    for (const criterion of criteria) {
      const assignmentsForCriterion = assignments.filter(
        (item) => item.criterionId === criterion.id,
      );
      const distinctPairKeys = new Set(
        assignmentsForCriterion.map(({ groupAId, groupBId }) =>
          [groupAId, groupBId].sort().join(":"),
        ),
      );

      expect(assignmentsForCriterion).toHaveLength(3);
      expect(distinctPairKeys).toHaveLength(3);
    }
  });

  it("rejects duplicate pair generation for the same assignment", () => {
    const repository = new FakePairAssignmentRepository();
    const service = new PairingService(repository);
    const assignment = makeAssignment();
    const request = {
      assignmentId: assignment.id,
      groups: [
        makeGroup({ id: "group-a" }),
        makeGroup({ id: "group-b" }),
        makeGroup({ id: "group-c" }),
      ],
      criteria: [makeCriterion()],
      evaluators: [
        makeStudent({ id: "student-a", groupId: "group-a" }),
        makeStudent({ id: "student-b", groupId: "group-b" }),
        makeStudent({ id: "student-c", groupId: "group-c" }),
      ],
    };

    service.generatePairAssignments(request);

    expect(() => service.generatePairAssignments(request)).toThrow(
      PairingRuleError,
    );
  });

  it("never assigns a student to a pair containing their own group", () => {
    const repository = new FakePairAssignmentRepository();
    const service = new PairingService(repository);
    const assignment = makeAssignment();
    const groups = [
      makeGroup({ id: "group-a" }),
      makeGroup({ id: "group-b" }),
      makeGroup({ id: "group-c" }),
    ];
    const evaluators = [
      makeStudent({ id: "student-a", groupId: "group-a" }),
      makeStudent({ id: "student-b", groupId: "group-b" }),
      makeStudent({ id: "student-c", groupId: "group-c" }),
    ];

    const assignments = service.generatePairAssignments({
      assignmentId: assignment.id,
      groups,
      criteria: [makeCriterion()],
      evaluators,
    });

    const evaluatorGroupByStudentId = new Map(
      evaluators.map((student) => [student.id, student.groupId]),
    );

    expect(assignments).toHaveLength(3);

    for (const assignment of assignments) {
      const evaluatorGroupId = evaluatorGroupByStudentId.get(
        assignment.evaluatorStudentId,
      );

      expect([assignment.groupAId, assignment.groupBId]).not.toContain(
        evaluatorGroupId,
      );
    }
  });
});

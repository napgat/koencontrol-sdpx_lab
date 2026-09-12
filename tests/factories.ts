export type TestAssignment = {
  id: string;
};

export type TestGroup = {
  id: string;
  name: string;
};

export type TestStudent = {
  id: string;
  groupId: string;
};

export type TestCriterion = {
  id: string;
  name: string;
};

export const makeAssignment = (
  overrides: Partial<TestAssignment> = {},
): TestAssignment => ({
  id: "assignment-1",
  ...overrides,
});

export const makeGroup = (
  overrides: Partial<TestGroup> = {},
): TestGroup => ({
  id: "group-a",
  name: "Group A",
  ...overrides,
});

export const makeStudent = (
  overrides: Partial<TestStudent> = {},
): TestStudent => ({
  id: "student-1",
  groupId: "group-a",
  ...overrides,
});

export const makeCriterion = (
  overrides: Partial<TestCriterion> = {},
): TestCriterion => ({
  id: "criterion-1",
  name: "Technical Implementation",
  ...overrides,
});
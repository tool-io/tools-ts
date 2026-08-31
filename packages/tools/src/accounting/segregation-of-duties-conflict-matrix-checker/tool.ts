import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  binary,
  shape,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly userRoleAssignmentFlags: readonly (readonly number[])[];
  readonly callerConflictingRoleIndexPairs: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly userAndConflictingRoleTriples: readonly (readonly number[])[];
  readonly conflictedUserIndices: readonly number[];
  readonly noDeclaredRoleConflictsObserved: boolean;
}>;
const inputFields = [
  {
    id: "userRoleAssignmentFlags",
    label: "User role assignment flags",
    kind: "matrix",
  },
  {
    id: "callerConflictingRoleIndexPairs",
    label: "Caller conflicting role index pairs",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const width = shape(input.userRoleAssignmentFlags, "assignments");
  input.userRoleAssignmentFlags.forEach((r) => binary(r, "roles"));
  if (shape(input.callerConflictingRoleIndexPairs, "conflicts") !== 2)
    simpleError("conflicts", "Explicit role-index pairs required.");
  const conflicts = input.callerConflictingRoleIndexPairs.map(([a, b]) => {
    bounded(a, "role", 0, width - 1);
    bounded(b, "role", 0, width - 1);
    if (a === b) simpleError("roles", "Conflict must name two distinct roles.");
    return [a, b].sort((a, b) => a - b);
  });
  if (new Set(conflicts.map((v) => v.join(","))).size !== conflicts.length)
    simpleError(
      "conflicts",
      "Duplicate symmetric conflict rules are not allowed.",
    );
  const triples: number[][] = [],
    users: number[] = [];
  input.userRoleAssignmentFlags.forEach((r, i) => {
    let found = false;
    conflicts.forEach(([a, b]) => {
      if (r[a] && r[b]) {
        if (triples.length >= 128)
          simpleError(
            "conflicts",
            "Conflict witnesses exceed the 128-row matrix output budget; narrow the caller review scope.",
            "resource_limit",
          );
        triples.push([i, a, b]);
        found = true;
      }
    });
    if (found) users.push(i);
  });
  return {
    userAndConflictingRoleTriples: triples,
    conflictedUserIndices: users,
    noDeclaredRoleConflictsObserved: users.length === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  userRoleAssignmentFlags: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  callerConflictingRoleIndexPairs: [[0, 1]],
} satisfies Input;
export const exampleOutput = {
  userAndConflictingRoleTriples: [[0, 0, 1]],
  conflictedUserIndices: [0],
  noDeclaredRoleConflictsObserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/segregation-of-duties-conflict-matrix-checker",
  title: "Segregation Of Duties Conflict Matrix Checker",
  description:
    "Evaluate actual user-role assignment matrix against caller forbidden role pairs, deduplicating symmetric rules and exposing conflict witnesses; no inference about authorization, compensating controls or complete segregation compliance.",
  inputs: inputFields,
  outputs: [
    {
      id: "userAndConflictingRoleTriples",
      label: "User and conflicting role triples",
      kind: "matrix",
    },
    {
      id: "conflictedUserIndices",
      label: "Conflicted user indices",
      kind: "numberList",
    },
    {
      id: "noDeclaredRoleConflictsObserved",
      label: "No declared role conflicts observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      userRoleAssignmentFlags:
        value.userRoleAssignmentFlags as readonly (readonly number[])[],
      callerConflictingRoleIndexPairs:
        value.callerConflictingRoleIndexPairs as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

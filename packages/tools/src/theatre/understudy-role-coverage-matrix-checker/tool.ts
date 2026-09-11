import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  binary,
  unique,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerRoleIds: readonly string[];
  readonly callerPerformerIds: readonly string[];
  readonly independentlyVerifiedCoverageMatrix: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerRoleIds", label: "Caller role ids", kind: "stringList" },
  {
    id: "callerPerformerIds",
    label: "Caller performer ids",
    kind: "stringList",
  },
  {
    id: "independentlyVerifiedCoverageMatrix",
    label: "Independently verified coverage matrix",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerRoleIds, "roles");
  unique(input.callerPerformerIds, "performers");
  if (
    input.callerRoleIds.length > 32 ||
    input.callerPerformerIds.length > 32 ||
    input.independentlyVerifiedCoverageMatrix.length !==
      input.callerRoleIds.length ||
    input.independentlyVerifiedCoverageMatrix.some(
      (r) => r.length !== input.callerPerformerIds.length,
    )
  )
    simpleError(
      "matrix",
      "At most 32×32explicit role/performer compatibility observations.",
    );
  input.independentlyVerifiedCoverageMatrix.forEach((r) =>
    binary(r, "coverage"),
  );
  const owner = Array(input.callerPerformerIds.length).fill(-1) as number[],
    visit = (role: number, seen: Set<number>): boolean => {
      for (let p = 0; p < owner.length; p++)
        if (
          input.independentlyVerifiedCoverageMatrix[role][p] &&
          !seen.has(p)
        ) {
          seen.add(p);
          if (owner[p] < 0 || visit(owner[p], seen)) {
            owner[p] = role;
            return true;
          }
        }
      return false;
    };
  input.callerRoleIds.forEach((_, r) => visit(r, new Set()));
  const assignments = input.callerRoleIds.map((_, r) => owner.indexOf(r));
  return {
    simultaneousCoverPerformerIndicesByRole: assignments,
    unmatchedRoleIds: input.callerRoleIds.filter((_, i) => assignments[i] < 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerRoleIds: ["r1", "r2"],
    callerPerformerIds: ["p1", "p2"],
    independentlyVerifiedCoverageMatrix: [
      [1, 1],
      [1, 0],
    ],
  },
  output: {
    result: {
      simultaneousCoverPerformerIndicesByRole: [1, 0],
      unmatchedRoleIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/understudy-role-coverage-matrix-checker",
  title: "Understudy Role Coverage Matrix Checker",
  description:
    "Maximum one-performer-per-role simultaneous matching from actual independently verified coverage matrix, deterministic traversal and\u22121unmatched. Not vocal/physical readiness, contract availability or permission to cast/rehearse.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

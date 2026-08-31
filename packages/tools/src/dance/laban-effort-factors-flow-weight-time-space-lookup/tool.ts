import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  matrixFlags,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerEffortFactorAnnotations: readonly (readonly number[])[];
  readonly callerEffortEvidenceFlags: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly knownLowHighCountsByFlowWeightTimeSpace: readonly (readonly number[])[];
  readonly unknownCountsByFlowWeightTimeSpace: readonly number[];
}>;
const inputFields = [
  {
    id: "callerEffortFactorAnnotations",
    label: "Caller effort factor annotations",
    kind: "matrix",
  },
  {
    id: "callerEffortEvidenceFlags",
    label: "Caller effort evidence flags",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  matrixFlags(input.callerEffortFactorAnnotations, 4);
  matrixFlags(input.callerEffortEvidenceFlags, 4);
  aligned(
    input.callerEffortFactorAnnotations,
    input.callerEffortEvidenceFlags,
    "annotations",
  );
  const counts = [0, 1, 2, 3].map((c) =>
      [0, 1].map(
        (v) =>
          input.callerEffortFactorAnnotations.filter(
            (r, i) => input.callerEffortEvidenceFlags[i][c] && r[c] === v,
          ).length,
      ),
    ),
    unknown = [0, 1, 2, 3].map(
      (c) => input.callerEffortEvidenceFlags.filter((r) => !r[c]).length,
    );
  return {
    knownLowHighCountsByFlowWeightTimeSpace: counts,
    unknownCountsByFlowWeightTimeSpace: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEffortFactorAnnotations: [
    [0, 1, 0, 1],
    [1, 1, 0, 0],
  ],
  callerEffortEvidenceFlags: [
    [1, 1, 1, 1],
    [1, 0, 1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  knownLowHighCountsByFlowWeightTimeSpace: [
    [1, 1],
    [0, 1],
    [2, 0],
    [1, 1],
  ],
  unknownCountsByFlowWeightTimeSpace: [0, 1, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/laban-effort-factors-flow-weight-time-space-lookup",
  title: "Laban Effort Factors Flow Weight Time Space Lookup",
  description:
    "Inventory actual caller Laban effort annotations by ordered flow/weight/time/space polarities and explicit evidence mask; caller defines 0/1 poles, no automated psychological/body-quality inference or normative scores.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownLowHighCountsByFlowWeightTimeSpace",
      label: "Known low high counts by flow weight time space",
      kind: "matrix",
    },
    {
      id: "unknownCountsByFlowWeightTimeSpace",
      label: "Unknown counts by flow weight time space",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEffortFactorAnnotations:
        value.callerEffortFactorAnnotations as readonly (readonly number[])[],
      callerEffortEvidenceFlags:
        value.callerEffortEvidenceFlags as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

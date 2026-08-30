import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned, ledger } from "../shared.js";
export type Input = Readonly<{
  readonly callerGapClassIndices: readonly number[];
  readonly callerSignificanceClassIndices: readonly number[];
  readonly callerPriorityCellMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly resolvedCollectingGapPriorities: readonly number[];
}>;
const inputFields = [
  {
    id: "callerGapClassIndices",
    label: "Caller gap class indices",
    kind: "numberList",
  },
  {
    id: "callerSignificanceClassIndices",
    label: "Caller significance class indices",
    kind: "numberList",
  },
  {
    id: "callerPriorityCellMatrix",
    label: "Caller priority cell matrix",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerGapClassIndices.forEach((v) => count(v, "callerGapClassIndices"));
  input.callerSignificanceClassIndices.forEach((v) =>
    count(v, "callerSignificanceClassIndices"),
  );
  aligned(
    input.callerGapClassIndices,
    input.callerSignificanceClassIndices,
    "callerGapClassIndices",
  );
  ledger(input.callerPriorityCellMatrix, "policy");
  const cols = input.callerPriorityCellMatrix[0].length;
  if (
    input.callerGapClassIndices.some(
      (v, i) =>
        v >= input.callerPriorityCellMatrix.length ||
        input.callerSignificanceClassIndices[i] >= cols,
    )
  )
    simpleError("classes", "Class indices must be inside caller matrix.");
  return {
    resolvedCollectingGapPriorities: input.callerGapClassIndices.map(
      (v, i) =>
        input.callerPriorityCellMatrix[v][
          input.callerSignificanceClassIndices[i]
        ],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGapClassIndices: [0, 1],
  callerSignificanceClassIndices: [1, 0],
  callerPriorityCellMatrix: [
    [1, 2],
    [3, 4],
  ],
} satisfies Input;
export const exampleOutput = {
  resolvedCollectingGapPriorities: [2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/collecting-gap-priority-resolver",
  title: "Collecting Gap Priority Matrix Cell Resolver",
  description:
    "Resolve independently classified collecting gaps against caller explicit priority matrix without inventing classifications, thresholds or collecting mandates.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedCollectingGapPriorities",
      label: "Resolved collecting gap priorities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGapClassIndices: value.callerGapClassIndices as readonly number[],
      callerSignificanceClassIndices:
        value.callerSignificanceClassIndices as readonly number[],
      callerPriorityCellMatrix:
        value.callerPriorityCellMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;

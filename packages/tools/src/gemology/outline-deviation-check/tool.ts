import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  maximum,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly pairedOutlinePointsMm: readonly (readonly number[])[];
  readonly callerMirrorDeviationToleranceMm: number;
}>;
export type Output = Readonly<{
  readonly pairMirrorDeviationDistancesMm: readonly number[];
  readonly maximumMeasuredMirrorDeviationMm: number;
  readonly aboveCallerOutlineTolerance: boolean;
}>;
const inputFields = [
  {
    id: "pairedOutlinePointsMm",
    label: "Paired outline points mm",
    kind: "matrix",
  },
  {
    id: "callerMirrorDeviationToleranceMm",
    label: "Caller mirror deviation tolerance mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMirrorDeviationToleranceMm,
    "callerMirrorDeviationToleranceMm",
  );
  if (
    shape(input.pairedOutlinePointsMm, "points") !== 2 ||
    input.pairedOutlinePointsMm.length % 2 !== 0
  )
    simpleError(
      "points",
      "Paired two-dimensional outline points required, consecutive pairs around declared y-axis mirror.",
    );
  const d: number[] = [];
  for (let i = 0; i < input.pairedOutlinePointsMm.length; i += 2) {
    const a = input.pairedOutlinePointsMm[i],
      b = input.pairedOutlinePointsMm[i + 1];
    d.push(Math.hypot(a[0] + b[0], a[1] - b[1]));
  }
  return {
    pairMirrorDeviationDistancesMm: d,
    maximumMeasuredMirrorDeviationMm: maximum(d),
    aboveCallerOutlineTolerance:
      maximum(d) > input.callerMirrorDeviationToleranceMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pairedOutlinePointsMm: [
    [1, 2],
    [-1, 2],
    [2, 3],
    [-2.1, 3],
  ],
  callerMirrorDeviationToleranceMm: 0.05,
} satisfies Input;
export const exampleOutput = {
  pairMirrorDeviationDistancesMm: [0, 0.1],
  maximumMeasuredMirrorDeviationMm: 0.1,
  aboveCallerOutlineTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/outline-deviation-check",
  title: "Outline Deviation Symmetry Check",
  description:
    "Audit corresponding measured outline points about caller already-aligned mirror axis, preserving pair deviations; no automatic alignment, mineral shape ideal or inferred optical symmetry.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairMirrorDeviationDistancesMm",
      label: "Pair mirror deviation distances mm",
      kind: "numberList",
    },
    {
      id: "maximumMeasuredMirrorDeviationMm",
      label: "Maximum measured mirror deviation mm",
      kind: "number",
    },
    {
      id: "aboveCallerOutlineTolerance",
      label: "Above caller outline tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      pairedOutlinePointsMm:
        value.pairedOutlinePointsMm as readonly (readonly number[])[],
      callerMirrorDeviationToleranceMm:
        value.callerMirrorDeviationToleranceMm as number,
    }),
});
export const run = tool.execute;
export default tool;

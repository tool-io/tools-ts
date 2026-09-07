import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, points } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedInterposerReferencePlaneCoefficients: readonly number[];
  readonly observedInterposerXyM: readonly (readonly number[])[];
  readonly observedInterposerHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly referenceSubtractedInterposerHeightsM: readonly number[];
  readonly observedReferenceSubtractedInterposerWarpM: number;
}>;
const inputFields = [
  {
    id: "observedInterposerReferencePlaneCoefficients",
    label: "Observed interposer reference plane coefficients",
    kind: "numberList",
  },
  {
    id: "observedInterposerXyM",
    label: "Observed interposer xy m",
    kind: "matrix",
  },
  {
    id: "observedInterposerHeightsM",
    label: "Observed interposer heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  points(input.observedInterposerXyM);
  aligned(
    input.observedInterposerXyM,
    input.observedInterposerHeightsM,
    "survey",
  );
  if (input.observedInterposerReferencePlaneCoefficients.length !== 3)
    simpleError(
      "plane",
      "Caller independently established [offset, xSlope, ySlope] reference plane required.",
    );
  const [a, b, c] = input.observedInterposerReferencePlaneCoefficients,
    z = input.observedInterposerHeightsM.map(
      (v, i) =>
        v -
        a -
        b * input.observedInterposerXyM[i][0] -
        c * input.observedInterposerXyM[i][1],
    );
  return {
    referenceSubtractedInterposerHeightsM: z,
    observedReferenceSubtractedInterposerWarpM: Math.max(...z) - Math.min(...z),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedInterposerReferencePlaneCoefficients: [1, 2, 3],
  observedInterposerXyM: [
    [0, 0],
    [1, 0],
    [0, 1],
  ],
  observedInterposerHeightsM: [1, 4, 4],
} satisfies Input;
export const exampleOutput = {
  referenceSubtractedInterposerHeightsM: [0, 1, 0],
  observedReferenceSubtractedInterposerWarpM: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-interposer-warpage",
  title: "Semiconductor Silicon Interposer Warpage Calculator",
  description:
    "Subtract independently established local reference plane from actual silicon interposer survey before warp extraction; not raw extrema or geodesy/datum transformation.",
  inputs: inputFields,
  outputs: [
    {
      id: "referenceSubtractedInterposerHeightsM",
      label: "Reference subtracted interposer heights m",
      kind: "numberList",
    },
    {
      id: "observedReferenceSubtractedInterposerWarpM",
      label: "Observed reference subtracted interposer warp m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedInterposerReferencePlaneCoefficients:
        value.observedInterposerReferencePlaneCoefficients as readonly number[],
      observedInterposerXyM:
        value.observedInterposerXyM as readonly (readonly number[])[],
      observedInterposerHeightsM:
        value.observedInterposerHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

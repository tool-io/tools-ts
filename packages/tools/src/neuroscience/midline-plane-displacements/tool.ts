import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, norm } from "../shared.js";
export type Input = Readonly<{
  readonly pointsMm: readonly (readonly number[])[];
  readonly midlineNormal: readonly number[];
  readonly midlineOffsetMm: number;
}>;
export type Output = Readonly<{
  readonly signedDisplacementsMm: readonly number[];
  readonly maximumAbsoluteShiftMm: number;
}>;
const inputFields = [
  { id: "pointsMm", label: "Points mm", kind: "matrix" },
  { id: "midlineNormal", label: "Midline normal", kind: "numberList" },
  { id: "midlineOffsetMm", label: "Midline offset mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.midlineNormal.length !== 3 ||
    !input.pointsMm.length ||
    input.pointsMm.some((row) => row.length !== 3)
  )
    simpleError(
      "pointsMm",
      "Three-dimensional landmarks and midline plane normal required.",
    );
  const n = positive(norm(input.midlineNormal), "midlineNormal"),
    signedDisplacementsMm = input.pointsMm.map(
      (row) =>
        (row.reduce((s, v, i) => s + v * input.midlineNormal[i], 0) -
          input.midlineOffsetMm) /
        n,
    );
  return {
    signedDisplacementsMm,
    maximumAbsoluteShiftMm: Math.max(...signedDisplacementsMm.map(Math.abs)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pointsMm: [
    [2, 0, 0],
    [-1, 0, 0],
  ],
  midlineNormal: [1, 0, 0],
  midlineOffsetMm: 0,
} satisfies Input;
export const exampleOutput = {
  signedDisplacementsMm: [2, -1],
  maximumAbsoluteShiftMm: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/midline-plane-displacements",
  title: "Midline Shift",
  description:
    "Measure signed landmark distances from the explicit reference plane n·x=offset; this does not identify anatomical landmarks or severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDisplacementsMm",
      label: "Signed displacements mm",
      kind: "numberList",
    },
    {
      id: "maximumAbsoluteShiftMm",
      label: "Maximum absolute shift mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pointsMm: value.pointsMm as readonly (readonly number[])[],
      midlineNormal: value.midlineNormal as readonly number[],
      midlineOffsetMm: value.midlineOffsetMm as number,
    }),
});
export const run = tool.execute;
export default tool;

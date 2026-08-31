import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned, sum } from "../shared.js";
export type Input = Readonly<{
  readonly representativeWeightedAccelerationMPerS2: readonly number[];
  readonly representedSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly modelVibrationDoseValue: number;
  readonly representedDurationSeconds: number;
}>;
const inputFields = [
  {
    id: "representativeWeightedAccelerationMPerS2",
    label: "Representative weighted acceleration m per s2",
    kind: "numberList",
  },
  {
    id: "representedSeconds",
    label: "Represented seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedSeconds.forEach((v) => nonnegative(v, "representedSeconds"));
  aligned(
    input.representativeWeightedAccelerationMPerS2,
    input.representedSeconds,
    "representativeWeightedAccelerationMPerS2",
  );
  return {
    modelVibrationDoseValue:
      input.representativeWeightedAccelerationMPerS2.reduce(
        (s, v, i) => s + v ** 4 * input.representedSeconds[i],
        0,
      ) ** 0.25,
    representedDurationSeconds: sum(input.representedSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  representativeWeightedAccelerationMPerS2: [1, 2],
  representedSeconds: [16, 1],
} satisfies Input;
export const exampleOutput = {
  modelVibrationDoseValue: 2.378414230005442,
  representedDurationSeconds: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/wbv-vdv-estimate",
  title: "Whole-Body Vibration VDV Estimate Calculator",
  description:
    "Compute fourth-power weighted acceleration exposure VDV from explicitly represented constant-value bins; preserves transients instead of assuming one RMS crest factor, no ISO weighting filter or vibration safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelVibrationDoseValue",
      label: "Model vibration dose value",
      kind: "number",
    },
    {
      id: "representedDurationSeconds",
      label: "Represented duration seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      representativeWeightedAccelerationMPerS2:
        value.representativeWeightedAccelerationMPerS2 as readonly number[],
      representedSeconds: value.representedSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

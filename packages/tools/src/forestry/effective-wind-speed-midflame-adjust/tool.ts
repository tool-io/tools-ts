import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly referenceWindSpeedsMPerSecond: readonly number[];
  readonly windAdjustmentFactors: readonly number[];
  readonly durationWeightsSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly midflameWindSpeedsMPerSecond: readonly number[];
  readonly durationWeightedMidflameWindMPerSecond: number;
}>;
const inputFields = [
  {
    id: "referenceWindSpeedsMPerSecond",
    label: "Reference wind speeds m per second",
    kind: "numberList",
  },
  {
    id: "windAdjustmentFactors",
    label: "Wind adjustment factors",
    kind: "numberList",
  },
  {
    id: "durationWeightsSeconds",
    label: "Duration weights seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.referenceWindSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "referenceWindSpeedsMPerSecond"),
  );
  input.durationWeightsSeconds.forEach((v) =>
    nonnegative(v, "durationWeightsSeconds"),
  );
  input.windAdjustmentFactors.forEach((v) =>
    fraction(v, "windAdjustmentFactors"),
  );
  aligned(
    input.referenceWindSpeedsMPerSecond,
    input.windAdjustmentFactors,
    "referenceWindSpeedsMPerSecond",
  );
  aligned(
    input.referenceWindSpeedsMPerSecond,
    input.durationWeightsSeconds,
    "referenceWindSpeedsMPerSecond",
  );
  const total = positive(
      input.durationWeightsSeconds.reduce((a, b) => a + b, 0),
      "durationWeightsSeconds",
    ),
    midflameWindSpeedsMPerSecond = input.referenceWindSpeedsMPerSecond.map(
      (v, i) => v * input.windAdjustmentFactors[i],
    );
  return {
    midflameWindSpeedsMPerSecond,
    durationWeightedMidflameWindMPerSecond: midflameWindSpeedsMPerSecond.reduce(
      (s, v, i) => s + (v * input.durationWeightsSeconds[i]) / total,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceWindSpeedsMPerSecond: [2, 4],
  windAdjustmentFactors: [0.5, 0.25],
  durationWeightsSeconds: [1, 3],
} satisfies Input;
export const exampleOutput = {
  midflameWindSpeedsMPerSecond: [1, 1],
  durationWeightedMidflameWindMPerSecond: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/effective-wind-speed-midflame-adjust",
  title: "Midflame Effective Wind Speed Adjuster",
  description:
    "Transform reference wind observations with caller shelter/exposure factors and duration weights; no inferred canopy wind model or automatic wind/slope-equivalent spread input.",
  inputs: inputFields,
  outputs: [
    {
      id: "midflameWindSpeedsMPerSecond",
      label: "Midflame wind speeds m per second",
      kind: "numberList",
    },
    {
      id: "durationWeightedMidflameWindMPerSecond",
      label: "Duration weighted midflame wind m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceWindSpeedsMPerSecond:
        value.referenceWindSpeedsMPerSecond as readonly number[],
      windAdjustmentFactors: value.windAdjustmentFactors as readonly number[],
      durationWeightsSeconds: value.durationWeightsSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

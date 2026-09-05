import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  mean,
  interpolate,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly measuredStandardIntensities: readonly number[];
  readonly callerStandardReflectancePercents: readonly number[];
  readonly observedVitriniteIntensities: readonly number[];
}>;
export type Output = Readonly<{
  readonly calibratedRoPercents: readonly number[];
  readonly meanRoPercent: number;
}>;
const inputFields = [
  {
    id: "measuredStandardIntensities",
    label: "Measured standard intensities",
    kind: "numberList",
  },
  {
    id: "callerStandardReflectancePercents",
    label: "Caller standard reflectance percents",
    kind: "numberList",
  },
  {
    id: "observedVitriniteIntensities",
    label: "Observed vitrinite intensities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.measuredStandardIntensities,
    input.callerStandardReflectancePercents,
    "standards",
  );
  const r = input.observedVitriniteIntensities.map((v) =>
    interpolate(
      input.measuredStandardIntensities,
      input.callerStandardReflectancePercents,
      v,
    ),
  );
  r.forEach((v) => nonnegative(v, "reflectance"));
  return { calibratedRoPercents: r, meanRoPercent: mean(r) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredStandardIntensities: [1, 2],
  callerStandardReflectancePercents: [0.5, 1],
  observedVitriniteIntensities: [1.5, 2],
} satisfies Input;
export const exampleOutput = {
  calibratedRoPercents: [0.75, 1],
  meanRoPercent: 0.875,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/vitrinite-reflectance-ro",
  title: "Geology Vitrinite Reflectance Ro Calculator",
  description:
    "Actual standard-calibrated reflected intensities for independently identified vitrinite in same optical medium; no maturation identity or universal grade. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedRoPercents",
      label: "Calibrated ro percents",
      kind: "numberList",
    },
    { id: "meanRoPercent", label: "Mean ro percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredStandardIntensities:
        value.measuredStandardIntensities as readonly number[],
      callerStandardReflectancePercents:
        value.callerStandardReflectancePercents as readonly number[],
      observedVitriniteIntensities:
        value.observedVitriniteIntensities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

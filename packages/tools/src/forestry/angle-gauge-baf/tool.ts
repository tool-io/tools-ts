import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly gaugeOpeningMm: number;
  readonly gaugeEyeDistanceMm: number;
  readonly observedIncludedTreeWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly metricGaugeBaf: number;
  readonly weightedBasalAreaM2Ha: number;
}>;
const inputFields = [
  { id: "gaugeOpeningMm", label: "Gauge opening mm", kind: "number" },
  { id: "gaugeEyeDistanceMm", label: "Gauge eye distance mm", kind: "number" },
  {
    id: "observedIncludedTreeWeights",
    label: "Observed included tree weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gaugeOpeningMm, "gaugeOpeningMm");
  positive(input.gaugeEyeDistanceMm, "gaugeEyeDistanceMm");
  input.observedIncludedTreeWeights.forEach((v) =>
    nonnegative(v, "observedIncludedTreeWeights"),
  );
  if (input.observedIncludedTreeWeights.some((v) => v > 1))
    simpleError("weights", "Explicit inclusion weights0–1.");
  const scale = Math.max(input.gaugeOpeningMm, input.gaugeEyeDistanceMm),
    halfOpening = input.gaugeOpeningMm / scale / 2,
    sine =
      halfOpening / Math.hypot(halfOpening, input.gaugeEyeDistanceMm / scale),
    baf = 10000 * sine ** 2;
  positive(baf, "representable positive gauge factor");
  return {
    metricGaugeBaf: baf,
    weightedBasalAreaM2Ha: baf * sum(input.observedIncludedTreeWeights),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  gaugeOpeningMm: 10,
  gaugeEyeDistanceMm: 500,
  observedIncludedTreeWeights: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  metricGaugeBaf: 0.9999000099990001,
  weightedBasalAreaM2Ha: 1.4998500149985001,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/angle-gauge-baf",
  title: "Angle Gauge BAF Calculator",
  description:
    "Calibrate actual aperture/eye-distance angle gauge BAF and independently assigned inclusion weights, not prism-deflection-angle input or fixed plot tree area. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "metricGaugeBaf", label: "Metric gauge baf", kind: "number" },
    {
      id: "weightedBasalAreaM2Ha",
      label: "Weighted basal area m2 ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      gaugeOpeningMm: value.gaugeOpeningMm as number,
      gaugeEyeDistanceMm: value.gaugeEyeDistanceMm as number,
      observedIncludedTreeWeights:
        value.observedIncludedTreeWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

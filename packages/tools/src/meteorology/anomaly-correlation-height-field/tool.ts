import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned, norm } from "../shared.js";

export type Input = Readonly<{
  readonly forecastHeightFields: readonly number[];
  readonly observedHeightFields: readonly number[];
  readonly baselineNormalHeights: readonly number[];
  readonly representedAreaWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly uncenteredAnomalyCorrelation: number;
  readonly forecastAnomalyNorm: number;
  readonly observedAnomalyNorm: number;
}>;
const inputFields = [
  {
    id: "forecastHeightFields",
    label: "Forecast height fields",
    kind: "numberList",
  },
  {
    id: "observedHeightFields",
    label: "Observed height fields",
    kind: "numberList",
  },
  {
    id: "baselineNormalHeights",
    label: "Baseline normal heights",
    kind: "numberList",
  },
  {
    id: "representedAreaWeights",
    label: "Represented area weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedAreaWeights.forEach((v) =>
    positive(v, "representedAreaWeights"),
  );
  aligned(
    input.forecastHeightFields,
    input.observedHeightFields,
    "forecastHeightFields",
  );
  aligned(
    input.forecastHeightFields,
    input.baselineNormalHeights,
    "forecastHeightFields",
  );
  aligned(
    input.forecastHeightFields,
    input.representedAreaWeights,
    "forecastHeightFields",
  );
  const x = input.forecastHeightFields.map(
      (v, i) => v - input.baselineNormalHeights[i],
    ),
    y = input.observedHeightFields.map(
      (v, i) => v - input.baselineNormalHeights[i],
    ),
    forecastAnomalyNorm = positive(
      norm(x.map((v, i) => v * Math.sqrt(input.representedAreaWeights[i]))),
      "forecastAnomalyNorm",
    ),
    observedAnomalyNorm = positive(
      norm(y.map((v, i) => v * Math.sqrt(input.representedAreaWeights[i]))),
      "observedAnomalyNorm",
    ),
    dot = x.reduce(
      (s, v, i) =>
        s +
        (v / forecastAnomalyNorm) *
          (y[i] / observedAnomalyNorm) *
          input.representedAreaWeights[i],
      0,
    );
  return {
    uncenteredAnomalyCorrelation: Math.max(-1, Math.min(1, dot)),
    forecastAnomalyNorm,
    observedAnomalyNorm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  forecastHeightFields: [101, 202],
  observedHeightFields: [102, 204],
  baselineNormalHeights: [100, 200],
  representedAreaWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  uncenteredAnomalyCorrelation: 1,
  forecastAnomalyNorm: 3,
  observedAnomalyNorm: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/anomaly-correlation-height-field",
  title: "Anomaly Correlation Height Field",
  description:
    "Compute uncentered area-weighted anomaly correlation relative to caller climate-normal height field; differs from Pearson centered correlation, matched area exposure required and zero anomaly norms undefined.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncenteredAnomalyCorrelation",
      label: "Uncentered anomaly correlation",
      kind: "number",
    },
    {
      id: "forecastAnomalyNorm",
      label: "Forecast anomaly norm",
      kind: "number",
    },
    {
      id: "observedAnomalyNorm",
      label: "Observed anomaly norm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      forecastHeightFields: value.forecastHeightFields as readonly number[],
      observedHeightFields: value.observedHeightFields as readonly number[],
      baselineNormalHeights: value.baselineNormalHeights as readonly number[],
      representedAreaWeights: value.representedAreaWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

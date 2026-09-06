import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, curve } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedWellMatchedOutflowRatesM3Day: readonly number[];
  readonly observedRequiredBottomholePressuresPa: readonly number[];
  readonly queryOutflowRateM3Day: number;
}>;
export type Output = Readonly<{
  readonly interpolatedMeasuredTprPressurePa: number;
  readonly localObservedSecantSlope: number;
}>;
const inputFields = [
  {
    id: "observedWellMatchedOutflowRatesM3Day",
    label: "Observed well matched outflow rates m3 day",
    kind: "numberList",
  },
  {
    id: "observedRequiredBottomholePressuresPa",
    label: "Observed required bottomhole pressures pa",
    kind: "numberList",
  },
  {
    id: "queryOutflowRateM3Day",
    label: "Query outflow rate m3 day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWellMatchedOutflowRatesM3Day.forEach((v) =>
    positive(v, "observedWellMatchedOutflowRatesM3Day"),
  );
  positive(input.queryOutflowRateM3Day, "queryOutflowRateM3Day");
  input.observedRequiredBottomholePressuresPa.forEach((v) =>
    positive(v, "observedRequiredBottomholePressuresPa"),
  );
  const v = curve(
    input.observedWellMatchedOutflowRatesM3Day,
    input.observedRequiredBottomholePressuresPa,
    input.queryOutflowRateM3Day,
  );
  return {
    interpolatedMeasuredTprPressurePa: v.value,
    localObservedSecantSlope: v.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWellMatchedOutflowRatesM3Day: [1, 2, 3],
  observedRequiredBottomholePressuresPa: [2, 4, 8],
  queryOutflowRateM3Day: 2.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedMeasuredTprPressurePa: 6,
  localObservedSecantSlope: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/nodal-analysis-outflow-tpr",
  title: "Petroleum Nodal Analysis Outflow TPR Calculator",
  description:
    "Read actual matched tubing-outflow pressure/rate calibration, no fabricated multiphase vertical-lift correlation or optimum nodal solution. Piecewise linear measured calibration only; no extrapolation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMeasuredTprPressurePa",
      label: "Interpolated measured tpr pressure pa",
      kind: "number",
    },
    {
      id: "localObservedSecantSlope",
      label: "Local observed secant slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWellMatchedOutflowRatesM3Day:
        value.observedWellMatchedOutflowRatesM3Day as readonly number[],
      observedRequiredBottomholePressuresPa:
        value.observedRequiredBottomholePressuresPa as readonly number[],
      queryOutflowRateM3Day: value.queryOutflowRateM3Day as number,
    }),
});
export const run = tool.execute;
export default tool;

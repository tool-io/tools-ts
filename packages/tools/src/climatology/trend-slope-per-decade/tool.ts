import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  strictlyIncreasing,
  linearFit,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedYears: readonly number[];
  readonly observedTemperatureAnomaliesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly ordinaryLeastSquaresTrendCPerDecade: number;
  readonly residualAnomaliesC: readonly number[];
}>;
const inputFields = [
  { id: "observedYears", label: "Observed years", kind: "numberList" },
  {
    id: "observedTemperatureAnomaliesC",
    label: "Observed temperature anomalies c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  strictlyIncreasing(input.observedYears, "years");
  const fit = linearFit(
    input.observedYears,
    input.observedTemperatureAnomaliesC,
  );
  return {
    ordinaryLeastSquaresTrendCPerDecade: 10 * fit.slope,
    residualAnomaliesC: input.observedTemperatureAnomaliesC.map(
      (v, i) => v - fit.intercept - fit.slope * input.observedYears[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedYears: [2000, 2010, 2020],
  observedTemperatureAnomaliesC: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  ordinaryLeastSquaresTrendCPerDecade: 1,
  residualAnomaliesC: [0, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/trend-slope-per-decade",
  title: "Linear Trend Slope per Decade Calculator",
  description:
    "OLS actual irregular year climate trend, distinct from Sen median pair slopes; no autocorrelation adjusted interval or forecast. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "ordinaryLeastSquaresTrendCPerDecade",
      label: "Ordinary least squares trend c per decade",
      kind: "number",
    },
    {
      id: "residualAnomaliesC",
      label: "Residual anomalies c",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedYears: value.observedYears as readonly number[],
      observedTemperatureAnomaliesC:
        value.observedTemperatureAnomaliesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

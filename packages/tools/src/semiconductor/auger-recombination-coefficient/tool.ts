import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredAugerRatePerCubicMeterSecond: number;
  readonly matchedCarrierDensityPerCubicMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredAugerRatePerCubicMeterSecond",
    label: "Independently measured auger rate per cubic meter second",
    kind: "number",
  },
  {
    id: "matchedCarrierDensityPerCubicMeter",
    label: "Matched carrier density per cubic meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredAugerRatePerCubicMeterSecond, "rate");
  positive(input.matchedCarrierDensityPerCubicMeter, "density");
  return {
    conditionalSymmetricAugerCoefficientMetersSixPerSecond:
      input.independentlyMeasuredAugerRatePerCubicMeterSecond /
      input.matchedCarrierDensityPerCubicMeter ** 3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredAugerRatePerCubicMeterSecond: 8,
    matchedCarrierDensityPerCubicMeter: 2,
  },
  output: {
    result: { conditionalSymmetricAugerCoefficientMetersSixPerSecond: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/auger-recombination-coefficient",
  title: "Semiconductor Auger Recombination Coefficient Calculator",
  description:
    "Explicit symmetric n=p AugerCeff=RA/n\u00b3extraction from independently separated Augerrate. Not infer separate electron/hole coefficients or actual recombination mechanism from total rate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

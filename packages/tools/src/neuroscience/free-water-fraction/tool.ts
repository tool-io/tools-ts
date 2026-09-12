import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator: number;
  readonly actualIndependentlyFitTotalWaterSignalFractionDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator",
    label:
      "Actual independently fit named water compartment signal fraction numerator",
    kind: "number",
  },
  {
    id: "actualIndependentlyFitTotalWaterSignalFractionDenominator",
    label: "Actual independently fit total water signal fraction denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator,
    "actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator",
  );
  positive(
    input.actualIndependentlyFitTotalWaterSignalFractionDenominator,
    "actualIndependentlyFitTotalWaterSignalFractionDenominator",
  );
  return {
    value:
      (1 *
        input.actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator) /
      input.actualIndependentlyFitTotalWaterSignalFractionDenominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyFitNamedWaterCompartmentSignalFractionNumerator: 2,
    actualIndependentlyFitTotalWaterSignalFractionDenominator: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/free-water-fraction",
  title: "Free Water Fraction Calculator",
  description:
    "Qualified Free Water Fraction Calculator mixture fraction only, compartmentidentifiability, T2correction and acquisition model external; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

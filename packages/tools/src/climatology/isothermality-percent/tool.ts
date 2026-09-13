import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMeanMonthlyDiurnalTemperatureRange: number;
  readonly actualAnnualTemperatureRange: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeanMonthlyDiurnalTemperatureRange",
    label: "Actual mean monthly diurnal temperature range",
    kind: "number",
  },
  {
    id: "actualAnnualTemperatureRange",
    label: "Actual annual temperature range",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMeanMonthlyDiurnalTemperatureRange,
    "actualMeanMonthlyDiurnalTemperatureRange",
  );
  positive(input.actualAnnualTemperatureRange, "actualAnnualTemperatureRange");
  return {
    value:
      (100 * input.actualMeanMonthlyDiurnalTemperatureRange) /
      input.actualAnnualTemperatureRange,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMeanMonthlyDiurnalTemperatureRange: 5,
    actualAnnualTemperatureRange: 10,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/isothermality-percent",
  title: "Isothermality Percent Calculator",
  description:
    "BIO3isothermality100BIO2/BIO7matchedcompleteclimatologyperiods,not directspeciesclimateenvelope. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

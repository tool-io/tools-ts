import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCompleteMonthlyMeanTemperaturesC: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteMonthlyMeanTemperaturesC",
    label: "Actual complete monthly mean temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualCompleteMonthlyMeanTemperaturesC.length)
    simpleError(
      "actualCompleteMonthlyMeanTemperaturesC",
      "Actualnonemptyobservations.",
    );
  if (input.actualCompleteMonthlyMeanTemperaturesC.length !== 12)
    simpleError("months", "Actual12completeorderedmonthlymeans.");
  return {
    value:
      Math.max(...input.actualCompleteMonthlyMeanTemperaturesC) -
      Math.min(...input.actualCompleteMonthlyMeanTemperaturesC),
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
    actualCompleteMonthlyMeanTemperaturesC: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ],
  },
  output: { result: { value: 11 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/annual-temp-range",
  title: "Annual Temperature Range Extractor",
  description:
    "Actualcomplete12-monthmeanmax-minannualrange,not annualabsoluteweatherextremes. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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

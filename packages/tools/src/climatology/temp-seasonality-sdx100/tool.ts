import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, mean } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualCompleteMonthlyMeanTemperaturesC: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualCompleteMonthlyMeanTemperaturesC",
    label: "Actual complete monthly mean temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualCompleteMonthlyMeanTemperaturesC.length)
    simpleError(
      "actualCompleteMonthlyMeanTemperaturesC",
      "Actualnonemptyobservations.",
    );
  if (input.actualCompleteMonthlyMeanTemperaturesC.length !== 12)
    simpleError("months", "Actual12completeorderedmonthlymeans.");
  return {
    value:
      100 *
      Math.sqrt(
        mean(
          input.actualCompleteMonthlyMeanTemperaturesC.map(
            (v) =>
              (v - mean(input.actualCompleteMonthlyMeanTemperaturesC)) ** 2,
          ),
        ),
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualCompleteMonthlyMeanTemperaturesC: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ],
  },
  output: { result: { value: 345.2052529534663 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/temp-seasonality-sdx100",
  title: "Temperature Seasonality SD x100 Calculator",
  description:
    "BIO4populationSDactual12monthlymeans\u00d7100\u00b0C convention,not sampleSDorcoefficientofvariation. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

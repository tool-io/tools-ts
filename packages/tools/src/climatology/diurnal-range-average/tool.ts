import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  mean,
  aligned,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDailyMaximumTemperaturesC: readonly number[];
  readonly actualDailyMinimumTemperaturesC: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDailyMaximumTemperaturesC",
    label: "Actual daily maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "actualDailyMinimumTemperaturesC",
    label: "Actual daily minimum temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualDailyMaximumTemperaturesC.length)
    simpleError(
      "actualDailyMaximumTemperaturesC",
      "Actualnonemptyobservations.",
    );
  if (!input.actualDailyMinimumTemperaturesC.length)
    simpleError(
      "actualDailyMinimumTemperaturesC",
      "Actualnonemptyobservations.",
    );
  aligned(
    input.actualDailyMaximumTemperaturesC,
    input.actualDailyMinimumTemperaturesC,
    "days",
  );
  if (
    input.actualDailyMaximumTemperaturesC.some(
      (v, i) => v < input.actualDailyMinimumTemperaturesC[i],
    )
  )
    simpleError("extrema", "Dailymax≥min.");
  return {
    value: mean(
      input.actualDailyMaximumTemperaturesC.map(
        (v, i) => v - input.actualDailyMinimumTemperaturesC[i],
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
    actualDailyMaximumTemperaturesC: [10, 20],
    actualDailyMinimumTemperaturesC: [5, 15],
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/diurnal-range-average",
  title: "Diurnal Temperature Range Averager",
  description:
    "Actualmatchingdailymax\u2212minarithmeticmean,not pairedmonthlyextreme subtraction. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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

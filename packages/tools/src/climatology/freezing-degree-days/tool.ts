import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, sum } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualDailyMeanTemperaturesC: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDailyMeanTemperaturesC",
    label: "Actual daily mean temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualDailyMeanTemperaturesC.length)
    simpleError("actualDailyMeanTemperaturesC", "Actualnonemptyobservations.");
  return {
    value: sum(input.actualDailyMeanTemperaturesC.map((v) => Math.max(0, -v))),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualDailyMeanTemperaturesC: [-2, -1, 0, 1, 2] },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/freezing-degree-days",
  title: "Accumulated Freezing Degree Days Calculator",
  description:
    "ObservedzeroC freezing indexdegree-daysmean-threshold,not max/mindaycomputationsor Stefanice-growth forecast. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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

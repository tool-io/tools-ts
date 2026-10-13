import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualGapFreeDailyTemperaturesC: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualGapFreeDailyTemperaturesC",
    label: "Actual gap free daily temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualGapFreeDailyTemperaturesC.length)
    simpleError(
      "actualGapFreeDailyTemperaturesC",
      "Actualnonemptyobservations.",
    );
  return {
    value: input.actualGapFreeDailyTemperaturesC.filter((v) => v > 25).length,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualGapFreeDailyTemperaturesC: [25, 26, 24] },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/summer-days-su25-counter",
  title: "Summer Days SU25 Counter",
  description:
    "Observed ETCCDIsummerdaysTX>25Cstrictendpoints/gapfreecompleteperiodexternallyverified,no missing-dayimputation. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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

import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualGapFreeDailyTemperaturesC: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualGapFreeDailyTemperaturesC",
    label: "Actual gap free daily temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualGapFreeDailyTemperaturesC.length)
    simpleError(
      "actualGapFreeDailyTemperaturesC",
      "Actualnonemptyobservations.",
    );
  return {
    value: input.actualGapFreeDailyTemperaturesC.filter((v) => v > 20).length,
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
  input: { actualGapFreeDailyTemperaturesC: [20, 21, 19] },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/tropical-nights-counter",
  title: "Tropical Nights TR20 Counter",
  description:
    "Observed ETCCDItropicalnightsTN>20Cstrictendpoints/gapfreecompleteperiodexternallyverified,no missing-dayimputation. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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

import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualGroupSize: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualGroupSize", label: "Actual group size", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualGroupSize, "actualGroupSize", 0, 1000000);
  bounded(input.actualGroupSize, "group", 0, 365);
  return {
    value:
      1 -
      Array.from(
        { length: input.actualGroupSize },
        (_, i) => 1 - i / 365,
      ).reduce((a, b) => a * b, 1),
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
  input: { actualGroupSize: 2 },
  output: { result: { value: 0.002739726027397249 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/birthday-paradox",
  title: "Birthday Paradox Checker",
  description:
    "Exact365equallylikelyindependentbirthdaycollisionprobability,not cryptographicbirthdayboundapproximation;group\u2264365.",
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

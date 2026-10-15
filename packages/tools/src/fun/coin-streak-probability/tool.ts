import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualSpecifiedStreakLength: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSpecifiedStreakLength",
    label: "Actual specified streak length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(
    input.actualSpecifiedStreakLength,
    "actualSpecifiedStreakLength",
    1,
    1000000,
  );
  return { value: 2 ** -input.actualSpecifiedStreakLength };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualSpecifiedStreakLength: 3 },
  output: { result: { value: 0.125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/coin-streak-probability",
  title: "Flip a Coin Streak Probability Calculator",
  description:
    "ProbabilityofONESPECIFIEDall-headsblock ofnindependentfairtosses,not anyrunoccurrenceinlongersequence.",
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyObservedLetterCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyObservedLetterCount",
    label: "Independently observed letter count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.independentlyObservedLetterCount, "count", 0, 10000);
  return { hasObservedLetters: input.independentlyObservedLetterCount > 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyObservedLetterCount: 1 },
  output: { result: { hasObservedLetters: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/no-letter-rule-checker",
  title: "No-Letter Rule Violation Checker",
  description:
    "Screen independently witnessed independentlyObservedLetterCountagainst a no-letter/no-seal design preference, not automatic image recognition or flag invalidity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

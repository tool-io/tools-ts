import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bigCollatz } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualPositiveStartDecimal: string;
  readonly actualIterationBudget: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPositiveStartDecimal",
    label: "Actual positive start decimal",
    kind: "string",
  },
  {
    id: "actualIterationBudget",
    label: "Actual iteration budget",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    observedMaximumUntilOneDecimal: bigCollatz(
      input.actualPositiveStartDecimal,
      input.actualIterationBudget,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPositiveStartDecimal: "27", actualIterationBudget: 1000 },
  output: { result: { observedMaximumUntilOneDecimal: "9232" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/collatz-max-value",
  title: "Collatz Max Value Calculator",
  description:
    "ExactintegerCollatzpeakonlywhen1reached with inexplicit budget, start canonical decimal\u2264 128 digits, no global termination proof. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedMaximumUntilOneDecimal: { type: "string" } },
        required: ["observedMaximumUntilOneDecimal"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

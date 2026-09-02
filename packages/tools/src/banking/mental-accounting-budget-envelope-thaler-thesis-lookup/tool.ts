import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Mental accounting describes how people frame and separate financial outcomes/accounts rather than treat every unit as fully fungible.",
        reference: "Thaler, Mental Accounting Matters 1999.",
        limitations:
          "A behavioral theory, not universal diagnosis or proof that a budgeting method improves every outcome.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Mental accounting describes how people frame and separate financial outcomes/accounts rather than treat every unit as fully fungible.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/mental-accounting-budget-envelope-thaler-thesis-lookup",
  title: "Mental Accounting Budget Envelope Thaler Thesis Lookup",
  description:
    "Bounded offline reference: Mental accounting describes how people frame and separate financial outcomes/accounts rather than treat every unit as fully fungible. Source: Thaler, Mental Accounting Matters 1999. A behavioral theory, not universal diagnosis or proof that a budgeting method improves every outcome. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

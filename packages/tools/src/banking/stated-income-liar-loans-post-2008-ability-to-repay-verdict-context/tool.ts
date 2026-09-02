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
          "The post-crisis ability-to-repay framework requires consideration of repayment ability for covered mortgage transactions, subject to definitions and exceptions.",
        reference: "12CFR1026.43; CFPB, ability-to-repay guidance.",
        limitations:
          "The stigmatizing liar-loan label is not proof of borrower fraud; not all loans or income methods fall under one rule.",
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
      text: "The post-crisis ability-to-repay framework requires consideration of repayment ability for covered mortgage transactions, subject to definitions and exceptions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/stated-income-liar-loans-post-2008-ability-to-repay-verdict-context",
  title: "Stated Income Liar Loans Post 2008 Ability to Repay Verdict Context",
  description:
    "Bounded offline reference: The post-crisis ability-to-repay framework requires consideration of repayment ability for covered mortgage transactions, subject to definitions and exceptions. Source: 12CFR1026.43; CFPB, ability-to-repay guidance. The stigmatizing liar-loan label is not proof of borrower fraud; not all loans or income methods fall under one rule. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

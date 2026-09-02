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
          "US Regulation Eoverdraft opt-in rules concern charging fees for paying specified ATM/one-time debit-card transactions.",
        reference: "12CFR1005.17;2010 implementation history.",
        limitations:
          "Not a universal ban on all overdraft fees or a requirement to approve transactions.",
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
      text: "US Regulation Eoverdraft opt-in rules concern charging fees for paying specified ATM/one-time debit-card transactions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/reg-e-opt-in-overdraft-atm-debit-2010-rule-history",
  title: "Reg E Opt in Overdraft Atm Debit 2010 Rule History",
  description:
    "Bounded offline reference: US Regulation Eoverdraft opt-in rules concern charging fees for paying specified ATM/one-time debit-card transactions. Source: 12CFR1005.17;2010 implementation history. Not a universal ban on all overdraft fees or a requirement to approve transactions. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

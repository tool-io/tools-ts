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
          "Notional pooling can offset balances for interest calculation without a physical transfer of every balance.",
        reference:
          "Treasury pooling agreements and jurisdiction-specific guidance.",
        limitations:
          "Cross-currency, guarantee, tax and regulatory conditions matter; it is not automatically settlement-free netting everywhere.",
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
      text: "Notional pooling can offset balances for interest calculation without a physical transfer of every balance.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/notional-pooling-multicurrency-offset-no-settlement-lookup",
  title: "Notional Pooling Multicurrency Offset No Settlement Lookup",
  description:
    "Bounded offline reference: Notional pooling can offset balances for interest calculation without a physical transfer of every balance. Source: Treasury pooling agreements and jurisdiction-specific guidance. Cross-currency, guarantee, tax and regulatory conditions matter; it is not automatically settlement-free netting everywhere. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

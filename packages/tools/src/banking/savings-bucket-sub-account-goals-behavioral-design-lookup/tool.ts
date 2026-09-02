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
          "Savings buckets partition displayed goals or balances and may be sub-ledgers rather than legally separate insured accounts.",
        reference:
          "Behavioral budgeting literature; institution account disclosures.",
        limitations:
          "A bucket label does not create additional deposit insurance or guarantee savings behavior.",
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
      text: "Savings buckets partition displayed goals or balances and may be sub-ledgers rather than legally separate insured accounts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/savings-bucket-sub-account-goals-behavioral-design-lookup",
  title: "Savings Bucket Sub Account Goals Behavioral Design Lookup",
  description:
    "Bounded offline reference: Savings buckets partition displayed goals or balances and may be sub-ledgers rather than legally separate insured accounts. Source: Behavioral budgeting literature; institution account disclosures. A bucket label does not create additional deposit insurance or guarantee savings behavior. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

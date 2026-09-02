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
          "Zero-balance-account structures can sweep funds between master and subsidiary accounts under explicit bank agreements.",
        reference: "Treasury cash-management account documentation.",
        limitations:
          "Settlement, fees and overdraft terms vary; a displayed zero balance does not prove no exposure.",
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
      text: "Zero-balance-account structures can sweep funds between master and subsidiary accounts under explicit bank agreements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/zba-zero-balance-account-sweep-structure-lookup",
  title: "ZBA Zero Balance Account Sweep Structure Lookup",
  description:
    "Bounded offline reference: Zero-balance-account structures can sweep funds between master and subsidiary accounts under explicit bank agreements. Source: Treasury cash-management account documentation. Settlement, fees and overdraft terms vary; a displayed zero balance does not prove no exposure. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

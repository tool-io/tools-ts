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
          "Credit unions are member-owned financial cooperatives; surplus use can include reserves, services, rates or distributions under governing requirements.",
        reference: "NCUA, credit-union structure guidance.",
        limitations:
          "Not every surplus must be paid as cash dividend or every credit union has identical tax/regulatory status.",
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
      text: "Credit unions are member-owned financial cooperatives; surplus use can include reserves, services, rates or distributions under governing requirements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/credit-union-not-for-profit-surplus-member-return-structure",
  title: "Credit Union Not For Profit Surplus Member Return Structure",
  description:
    "Bounded offline reference: Credit unions are member-owned financial cooperatives; surplus use can include reserves, services, rates or distributions under governing requirements. Source: NCUA, credit-union structure guidance. Not every surplus must be paid as cash dividend or every credit union has identical tax/regulatory status. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

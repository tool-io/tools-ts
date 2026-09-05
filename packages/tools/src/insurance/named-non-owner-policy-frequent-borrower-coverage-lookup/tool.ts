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
          "Named non-owner auto forms can cover specified liability for a named person using non-owned vehicles under exclusions.",
        reference: "Actual non-owner auto policy forms.",
        limitations:
          "Not owned-vehicle coverage or automatically adequate for frequent borrowing; regular-use and household exclusions matter.",
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
      text: "Named non-owner auto forms can cover specified liability for a named person using non-owned vehicles under exclusions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/named-non-owner-policy-frequent-borrower-coverage-lookup",
  title: "Named Non Owner Policy Frequent Borrower Coverage Lookup",
  description:
    "Bounded offline reference: Named non-owner auto forms can cover specified liability for a named person using non-owned vehicles under exclusions. Source: Actual non-owner auto policy forms. Not owned-vehicle coverage or automatically adequate for frequent borrowing; regular-use and household exclusions matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

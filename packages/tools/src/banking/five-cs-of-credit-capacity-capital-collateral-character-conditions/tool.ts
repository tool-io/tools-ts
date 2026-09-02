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
    enum: ["capacity", "capital", "collateral", "character", "conditions"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        capacity: "Ability to service debt from relevant cash flows.",
        capital: "Borrower capital/resources at risk.",
        collateral:
          "Assets pledged and their independently verified enforceability/value.",
        character:
          "Documented repayment/management history, not protected-characteristic profiling.",
        conditions:
          "Loan purpose, economic setting and terms affecting repayment.",
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
  input: { topic: "capacity" },
  output: {
    result: { text: "Ability to service debt from relevant cash flows." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/five-cs-of-credit-capacity-capital-collateral-character-conditions",
  title: "Five Cs of Credit Capacity Capital Collateral Character Conditions",
  description:
    "Bounded offline reference: The Five Cs are a traditional credit-analysis mnemonic, not a scoring formula. Source: Commercial credit-analysis literature. Actual underwriting criteria and laws differ; no creditworthiness or approval certified. Supported topic keys: capacity, capital, collateral, character, conditions. No complete external corpus or live policy implied.",
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

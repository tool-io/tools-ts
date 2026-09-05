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
          "Key-person insurance can protect a business against loss of a specified insured person, with ownership and beneficiary design separately documented.",
        reference: "Business life-insurance planning disclosures.",
        limitations:
          "Consent, insurable interest, tax and employer-owned-policy rules vary; not automatic deductible premiums or tax-free proceeds.",
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
      text: "Key-person insurance can protect a business against loss of a specified insured person, with ownership and beneficiary design separately documented.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/key-person-insurance-business-continuation-beneficiary-design",
  title: "Key Person Insurance Business Continuation Beneficiary Design",
  description:
    "Bounded offline reference: Key-person insurance can protect a business against loss of a specified insured person, with ownership and beneficiary design separately documented. Source: Business life-insurance planning disclosures. Consent, insurable interest, tax and employer-owned-policy rules vary; not automatic deductible premiums or tax-free proceeds. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

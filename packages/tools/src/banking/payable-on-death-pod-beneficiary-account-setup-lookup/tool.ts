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
          "Payable-on-death designations name beneficiaries under applicable account and estate rules.",
        reference: "FDIC, trust-account insurance guidance; account contracts.",
        limitations:
          "Setup, revocation, capacity and distribution rules vary; not a substitute for jurisdiction-specific estate advice.",
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
      text: "Payable-on-death designations name beneficiaries under applicable account and estate rules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/payable-on-death-pod-beneficiary-account-setup-lookup",
  title: "Payable On Death POD Beneficiary Account Setup Lookup",
  description:
    "Bounded offline reference: Payable-on-death designations name beneficiaries under applicable account and estate rules. Source: FDIC, trust-account insurance guidance; account contracts. Setup, revocation, capacity and distribution rules vary; not a substitute for jurisdiction-specific estate advice. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

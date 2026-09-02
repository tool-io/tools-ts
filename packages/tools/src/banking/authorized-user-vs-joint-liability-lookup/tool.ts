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
          "An authorized user is permitted to use an account; joint holders can have contractual repayment obligations that differ from authorized-user status.",
        reference: "CFPB, credit-card account ownership guidance.",
        limitations:
          "Actual liability depends on contract, jurisdiction and facts; not a universal exemption or eligibility decision.",
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
      text: "An authorized user is permitted to use an account; joint holders can have contractual repayment obligations that differ from authorized-user status.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/authorized-user-vs-joint-liability-lookup",
  title: "Authorized User vs Joint Liability Lookup",
  description:
    "Bounded offline reference: An authorized user is permitted to use an account; joint holders can have contractual repayment obligations that differ from authorized-user status. Source: CFPB, credit-card account ownership guidance. Actual liability depends on contract, jurisdiction and facts; not a universal exemption or eligibility decision. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

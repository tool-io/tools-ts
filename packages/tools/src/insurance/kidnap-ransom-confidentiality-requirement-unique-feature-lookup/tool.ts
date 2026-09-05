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
          "Kidnap/ransom policies can contain confidentiality and specialized notification conditions intended to protect sensitive response arrangements.",
        reference: "K&Rpolicy wording and risk-management disclosures.",
        limitations:
          "No negotiation, evasion or ransom instructions; actual emergency response requires qualified authorities and trusted specialists.",
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
      text: "Kidnap/ransom policies can contain confidentiality and specialized notification conditions intended to protect sensitive response arrangements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/kidnap-ransom-confidentiality-requirement-unique-feature-lookup",
  title: "Kidnap Ransom Confidentiality Requirement Unique Feature Lookup",
  description:
    "Bounded offline reference: Kidnap/ransom policies can contain confidentiality and specialized notification conditions intended to protect sensitive response arrangements. Source: K&Rpolicy wording and risk-management disclosures. No negotiation, evasion or ransom instructions; actual emergency response requires qualified authorities and trusted specialists. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

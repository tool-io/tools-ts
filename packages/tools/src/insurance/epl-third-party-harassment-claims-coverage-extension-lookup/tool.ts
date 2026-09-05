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
          "Third-party employment-practices extensions can address specified claims by people outside the insured workforce under actual wording.",
        reference: "EPL policy endorsements.",
        limitations:
          "Not automatically included or identical to employee claims; no claim merits or coverage adjudication.",
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
      text: "Third-party employment-practices extensions can address specified claims by people outside the insured workforce under actual wording.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/epl-third-party-harassment-claims-coverage-extension-lookup",
  title: "EPL Third Party Harassment Claims Coverage Extension Lookup",
  description:
    "Bounded offline reference: Third-party employment-practices extensions can address specified claims by people outside the insured workforce under actual wording. Source: EPL policy endorsements. Not automatically included or identical to employee claims; no claim merits or coverage adjudication. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

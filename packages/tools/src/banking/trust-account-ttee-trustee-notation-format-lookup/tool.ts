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
          "Ttee is commonly shorthand for trustee in account titling, but notation alone does not establish a valid trust or authority.",
        reference: "Trust/account administration practice; account agreements.",
        limitations:
          "Verify governing documents, authorized parties and institution format; no legal status inferred from text.",
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
      text: "Ttee is commonly shorthand for trustee in account titling, but notation alone does not establish a valid trust or authority.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/trust-account-ttee-trustee-notation-format-lookup",
  title: "Trust Account Ttee Trustee Notation Format Lookup",
  description:
    "Bounded offline reference: Ttee is commonly shorthand for trustee in account titling, but notation alone does not establish a valid trust or authority. Source: Trust/account administration practice; account agreements. Verify governing documents, authorized parties and institution format; no legal status inferred from text. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

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
          "Pollution policies use specified event, discovery, claim or reporting triggers and can distinguish gradual from sudden conditions.",
        reference: "Pollution legal-liability policy forms.",
        limitations:
          "Labels alone do not establish coverage; dates, conditions, exclusions and law matter.",
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
      text: "Pollution policies use specified event, discovery, claim or reporting triggers and can distinguish gradual from sudden conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/pollution-legal-liability-gradual-versus-sudden-trigger-lookup",
  title: "Pollution Legal Liability Gradual Versus Sudden Trigger Lookup",
  description:
    "Bounded offline reference: Pollution policies use specified event, discovery, claim or reporting triggers and can distinguish gradual from sudden conditions. Source: Pollution legal-liability policy forms. Labels alone do not establish coverage; dates, conditions, exclusions and law matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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

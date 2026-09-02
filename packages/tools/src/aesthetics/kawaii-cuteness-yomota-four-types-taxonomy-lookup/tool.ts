import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Kawaii discourse encompasses historically changing cuteness and social interpretations; taxonomies require exact source attribution.",
        reference: "Yomota, Kawaii Ron 2006.",
        limitations:
          "No universally canonical four-types table or personality diagnosis fabricated.",
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
      text: "Kawaii discourse encompasses historically changing cuteness and social interpretations; taxonomies require exact source attribution.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/kawaii-cuteness-yomota-four-types-taxonomy-lookup",
  title: "Kawaii Cuteness Yomota Four Types Taxonomy Lookup",
  description:
    "Bounded offline reference: Kawaii discourse encompasses historically changing cuteness and social interpretations; taxonomies require exact source attribution. Source: Yomota, Kawaii Ron 2006. No universally canonical four-types table or personality diagnosis fabricated. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

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
          "Mother Goose names a publishing/storytelling attribution tradition, not a securely identified single author of all nursery rhymes.",
        reference: "Opie and Opie, The Oxford Dictionary of Nursery Rhymes.",
        limitations:
          "Distinguish publisher branding, regional legends and documented authors.",
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
      text: "Mother Goose names a publishing/storytelling attribution tradition, not a securely identified single author of all nursery rhymes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/mother-goose-authorship-attribution-myth-lookup",
  title: "Mother Goose Authorship Attribution Myth Lookup",
  description:
    "Bounded offline reference: Mother Goose names a publishing/storytelling attribution tradition, not a securely identified single author of all nursery rhymes. Source: Opie and Opie, The Oxford Dictionary of Nursery Rhymes. Distinguish publisher branding, regional legends and documented authors. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

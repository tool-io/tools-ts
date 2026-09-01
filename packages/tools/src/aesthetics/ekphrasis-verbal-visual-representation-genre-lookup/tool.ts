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
          "Ekphrasis is commonly discussed as verbal representation of visual representation, with broader historical usages.",
        reference:
          "Heffernan, Museum of Words 1993; classical rhetorical progymnasmata.",
        limitations:
          "Not every image caption is ekphrasis or every ekphrasis accurately documents an extant artwork.",
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
      text: "Ekphrasis is commonly discussed as verbal representation of visual representation, with broader historical usages.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/ekphrasis-verbal-visual-representation-genre-lookup",
  title: "Ekphrasis Verbal Visual Representation Genre Lookup",
  description:
    "Bounded offline reference: Ekphrasis is commonly discussed as verbal representation of visual representation, with broader historical usages. Source: Heffernan, Museum of Words 1993; classical rhetorical progymnasmata. Not every image caption is ekphrasis or every ekphrasis accurately documents an extant artwork. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

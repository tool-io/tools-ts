import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

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
          "Encomium develops praise and invective blame, often through selected ancestry, acts, character or comparisons.",
        reference:
          "Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology.",
        limitations:
          "These are genre descriptions, not authorizations for defamatory or demeaning claims.",
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
      text: "Encomium develops praise and invective blame, often through selected ancestry, acts, character or comparisons.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/encomium-invective-praise-blame-structure-lookup",
  title: "Encomium Invective Praise Blame Structure Lookup",
  description:
    "Offline bounded reference card: Encomium develops praise and invective blame, often through selected ancestry, acts, character or comparisons. References Quintilian, Institutio Oratoria; Aristotle, Rhetoric; Silva Rhetoricae rhetorical terminology. These are genre descriptions, not authorizations for defamatory or demeaning claims.",
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

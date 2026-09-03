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
          "Livys Ab urbe condita comprised 142 books;35 survive substantially as books1\u201310 and 21\u201345, with other material in summaries/fragments.",
        reference: "Livy manuscript tradition and Periochae.",
        limitations:
          "Survival count depends on substantially extant books, not absence of every fragment from the others.",
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
      text: "Livys Ab urbe condita comprised 142 books;35 survive substantially as books1\u201310 and 21\u201345, with other material in summaries/fragments.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/livy-ab-urbe-condita-142-books-only-35-survive-lookup",
  title: "Livy Ab Urbe Condita: 142 Books, Only 35 Survive Lookup",
  description:
    "Bounded offline reference: Livys Ab urbe condita comprised 142 books;35 survive substantially as books1\u201310 and 21\u201345, with other material in summaries/fragments. Source: Livy manuscript tradition and Periochae. Survival count depends on substantially extant books, not absence of every fragment from the others. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

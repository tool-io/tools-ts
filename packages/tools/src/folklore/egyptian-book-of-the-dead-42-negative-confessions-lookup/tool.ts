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
          "Book of the Dead spell 125 includes declarations of innocence before a divine tribunal, often described as 42negative confessions.",
        reference: "Egyptian Book of the Dead, spell 125.",
        limitations:
          "Wording, order and deities vary by manuscript; not an exhaustive fixed42-item text or moral truth test.",
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
      text: "Book of the Dead spell 125 includes declarations of innocence before a divine tribunal, often described as 42negative confessions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/egyptian-book-of-the-dead-42-negative-confessions-lookup",
  title: "Egyptian Book of the Dead42 Negative Confessions Lookup",
  description:
    "Bounded offline reference: Book of the Dead spell 125 includes declarations of innocence before a divine tribunal, often described as 42negative confessions. Source: Egyptian Book of the Dead, spell 125. Wording, order and deities vary by manuscript; not an exhaustive fixed42-item text or moral truth test. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

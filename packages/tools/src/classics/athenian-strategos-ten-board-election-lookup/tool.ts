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
          "Classical Athens commonly elected a board of ten strategoi with functions changing over time.",
        reference: "Aristotle, Athenian Constitution 61.",
        limitations:
          "Not every period has identical tribal allocation or command roles.",
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
      text: "Classical Athens commonly elected a board of ten strategoi with functions changing over time.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/athenian-strategos-ten-board-election-lookup",
  title: "Athenian Strategos Ten Board Election Lookup",
  description:
    "Offline bounded reference card: Classical Athens commonly elected a board of ten strategoi with functions changing over time. References Aristotle, Athenian Constitution 61. Not every period has identical tribal allocation or command roles.",
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

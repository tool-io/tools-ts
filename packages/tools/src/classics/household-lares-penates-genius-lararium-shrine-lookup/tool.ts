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
          "Lares, Penates and Genius could be represented in household cult; a lararium is a household shrine designation.",
        reference: "Pompeian household-shrine archaeological evidence.",
        limitations:
          "Objects and arrangements vary; not a universal complete household ritual template.",
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
      text: "Lares, Penates and Genius could be represented in household cult; a lararium is a household shrine designation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/household-lares-penates-genius-lararium-shrine-lookup",
  title: "Household Lares Penates Genius Lararium Shrine Lookup",
  description:
    "Offline bounded reference card: Lares, Penates and Genius could be represented in household cult; a lararium is a household shrine designation. References Pompeian household-shrine archaeological evidence. Objects and arrangements vary; not a universal complete household ritual template.",
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

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
          "Friday-the-thirteenth fear is discussed under several popular coined labels, including friggatriskaidekaphobia.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, Friday/thirteen.",
        limitations:
          "Terminology reference, not a clinical diagnostic criterion or proven Norse etymology.",
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
      text: "Friday-the-thirteenth fear is discussed under several popular coined labels, including friggatriskaidekaphobia.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/friday-thirteenth-friggatriskaidekaphobia-lookup",
  title: "Friday Thirteenth Friggatriskaidekaphobia Lookup",
  description:
    "Bounded offline reference: Friday-the-thirteenth fear is discussed under several popular coined labels, including friggatriskaidekaphobia. Source: Simpson and Roud, A Dictionary of English Folklore, Friday/thirteen. Terminology reference, not a clinical diagnostic criterion or proven Norse etymology. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

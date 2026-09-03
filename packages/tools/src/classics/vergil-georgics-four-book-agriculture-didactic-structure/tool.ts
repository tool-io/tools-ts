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
        book1:
          "Fields, crops, seasons and agricultural signs, with historical/political material.",
        book2:
          "Trees and vines, including cultivated growth and Italian praise.",
        book3: "Livestock and animal care, with the plague narrative.",
        book4: "Bees and the Aristaeus/Orpheus narrative.",
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
  input: { topic: "book1" },
  output: {
    result: {
      text: "Fields, crops, seasons and agricultural signs, with historical/political material.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/vergil-georgics-four-book-agriculture-didactic-structure",
  title: "Vergil Georgics Four Book Agriculture Didactic Structure",
  description:
    "Bounded offline reference: Vergils Georgics has four books with distinct principal agricultural subjects. Source: Vergil, Georgics1\u20134. Literary structure is not a current farming recipe or evidence that every excursus fits a single topic. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

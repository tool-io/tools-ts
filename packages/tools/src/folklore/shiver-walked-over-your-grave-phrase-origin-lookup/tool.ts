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
          "Someone walked over my grave is a conventional explanation phrase for a sudden shiver.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Phrase use is not evidence of grave location, predicted death or medical cause.",
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
      text: "Someone walked over my grave is a conventional explanation phrase for a sudden shiver.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/shiver-walked-over-your-grave-phrase-origin-lookup",
  title: "Shiver Walked Over Your Grave Phrase Origin Lookup",
  description:
    "Bounded offline reference: Someone walked over my grave is a conventional explanation phrase for a sudden shiver. Source: Simpson and Roud, A Dictionary of English Folklore. Phrase use is not evidence of grave location, predicted death or medical cause. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

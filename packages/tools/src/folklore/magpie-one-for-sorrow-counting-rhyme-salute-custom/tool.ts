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
          "One for sorrow magpie counting verses and salute customs vary by version and region.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No guaranteed outcome from bird count or complete universal rhyme text.",
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
      text: "One for sorrow magpie counting verses and salute customs vary by version and region.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/magpie-one-for-sorrow-counting-rhyme-salute-custom",
  title: "Magpie One For Sorrow Counting Rhyme Salute Custom",
  description:
    "Bounded offline reference: One for sorrow magpie counting verses and salute customs vary by version and region. Source: Simpson and Roud, A Dictionary of English Folklore. No guaranteed outcome from bird count or complete universal rhyme text. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

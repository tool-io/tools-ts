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
          "Broken-mirror seven-year bad-luck stories have disputed and retrospectively proposed origins.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, mirror.",
        limitations:
          "A supposed Roman regeneration explanation is not treated as a proven source.",
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
      text: "Broken-mirror seven-year bad-luck stories have disputed and retrospectively proposed origins.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/broken-mirror-seven-years-roman-origin-lookup",
  title: "Broken Mirror Seven Years Roman Origin Lookup",
  description:
    "Bounded offline reference: Broken-mirror seven-year bad-luck stories have disputed and retrospectively proposed origins. Source: Simpson and Roud, A Dictionary of English Folklore, mirror. A supposed Roman regeneration explanation is not treated as a proven source. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

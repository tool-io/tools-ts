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
          "New-shoes-on-table bad-luck accounts have several proposed origins; a prison-guard story is not universally verified.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Distinguish recorded custom from later explanation and causality.",
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
      text: "New-shoes-on-table bad-luck accounts have several proposed origins; a prison-guard story is not universally verified.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/new-shoes-on-table-death-origin-theory-uk-prison-guard",
  title: "New Shoes On Table Death Origin Theory Uk Prison Guard",
  description:
    "Bounded offline reference: New-shoes-on-table bad-luck accounts have several proposed origins; a prison-guard story is not universally verified. Source: Simpson and Roud, A Dictionary of English Folklore. Distinguish recorded custom from later explanation and causality. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

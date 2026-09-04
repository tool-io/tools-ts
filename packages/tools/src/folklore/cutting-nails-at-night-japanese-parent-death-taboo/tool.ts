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
          "Japanese nail-cutting-at-night taboos have varied explanations, including wordplay and family-death narratives.",
        reference: "Japanese superstition/folklore collections.",
        limitations:
          "No causal death prediction or universal Japanese practice.",
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
      text: "Japanese nail-cutting-at-night taboos have varied explanations, including wordplay and family-death narratives.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/cutting-nails-at-night-japanese-parent-death-taboo",
  title: "Cutting Nails At Night Japanese Parent Death Taboo",
  description:
    "Bounded offline reference: Japanese nail-cutting-at-night taboos have varied explanations, including wordplay and family-death narratives. Source: Japanese superstition/folklore collections. No causal death prediction or universal Japanese practice. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

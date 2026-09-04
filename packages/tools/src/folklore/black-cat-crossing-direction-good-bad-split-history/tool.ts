import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, pick } from "../batch44-shared.js";

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
          "Black-cat luck meanings differ by region, direction and situation, including positive and negative versions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No causal luck, universal historical origin or justification for animal mistreatment.",
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
      text: "Black-cat luck meanings differ by region, direction and situation, including positive and negative versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/black-cat-crossing-direction-good-bad-split-history",
  title: "Black Cat Crossing Direction Good Bad Split History",
  description:
    "Bounded offline reference: Black-cat luck meanings differ by region, direction and situation, including positive and negative versions. Source: Simpson and Roud, A Dictionary of English Folklore. No causal luck, universal historical origin or justification for animal mistreatment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

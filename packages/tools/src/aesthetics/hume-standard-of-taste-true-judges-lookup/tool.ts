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
          "Humes true-judge discussion emphasizes delicacy of sentiment, practice, comparison, freedom from prejudice and good sense.",
        reference: "Hume, Of the Standard of Taste 1757.",
        limitations:
          "Not an objective credentialing test or proof that taste is culturally neutral.",
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
      text: "Humes true-judge discussion emphasizes delicacy of sentiment, practice, comparison, freedom from prejudice and good sense.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/hume-standard-of-taste-true-judges-lookup",
  title: "Hume Standard of Taste True Judges Lookup",
  description:
    "Bounded offline reference: Humes true-judge discussion emphasizes delicacy of sentiment, practice, comparison, freedom from prejudice and good sense. Source: Hume, Of the Standard of Taste 1757. Not an objective credentialing test or proof that taste is culturally neutral. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

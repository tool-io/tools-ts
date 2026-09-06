import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Details grades describe qualifying impairment while separately describing remaining wear-level detail.",
        reference: "PCGS/NGC grading descriptions.",
        limitations:
          "Damage-code vocabulary differs by service/edition; details is not a universal numeric deduction or authenticity guarantee.",
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
      text: "Details grades describe qualifying impairment while separately describing remaining wear-level detail.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/details-grade-damage-code-lookup",
  title: "Details Grade Damage Code Lookup",
  description:
    "Bounded offline reference: Details grades describe qualifying impairment while separately describing remaining wear-level detail. Source: PCGS/NGC grading descriptions. Damage-code vocabulary differs by service/edition; details is not a universal numeric deduction or authenticity guarantee. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

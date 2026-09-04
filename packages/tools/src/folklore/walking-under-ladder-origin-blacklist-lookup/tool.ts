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
          "Walking-under-ladders explanations include retrospective symbolic origin theories.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Physical falling-object hazards are separate from luck claims; no superstition-based safety approval.",
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
      text: "Walking-under-ladders explanations include retrospective symbolic origin theories.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/walking-under-ladder-origin-blacklist-lookup",
  title: "Walking Under Ladder Origin Blacklist Lookup",
  description:
    "Bounded offline reference: Walking-under-ladders explanations include retrospective symbolic origin theories. Source: Simpson and Roud, A Dictionary of English Folklore. Physical falling-object hazards are separate from luck claims; no superstition-based safety approval. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

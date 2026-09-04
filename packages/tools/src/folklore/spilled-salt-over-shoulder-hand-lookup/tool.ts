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
          "Throwing spilled salt over the left shoulder is one recorded variant of a wider salt-luck tradition.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No universal required shoulder or causal protection; local variants differ.",
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
      text: "Throwing spilled salt over the left shoulder is one recorded variant of a wider salt-luck tradition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/spilled-salt-over-shoulder-hand-lookup",
  title: "Spilled Salt Over Shoulder Hand Lookup",
  description:
    "Bounded offline reference: Throwing spilled salt over the left shoulder is one recorded variant of a wider salt-luck tradition. Source: Simpson and Roud, A Dictionary of English Folklore. No universal required shoulder or causal protection; local variants differ. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

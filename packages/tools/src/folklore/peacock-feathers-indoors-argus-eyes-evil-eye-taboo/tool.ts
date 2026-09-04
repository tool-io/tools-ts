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
          "Peacock-feather taboos and eye symbolism occur in different local decorative/theatrical traditions.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore; classical Argus narrative.",
        limitations:
          "No proven single causal origin, universal evil-eye meaning or actual supernatural danger.",
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
      text: "Peacock-feather taboos and eye symbolism occur in different local decorative/theatrical traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/peacock-feathers-indoors-argus-eyes-evil-eye-taboo",
  title: "Peacock Feathers Indoors Argus Eyes Evil Eye Taboo",
  description:
    "Bounded offline reference: Peacock-feather taboos and eye symbolism occur in different local decorative/theatrical traditions. Source: Simpson and Roud, A Dictionary of English Folklore; classical Argus narrative. No proven single causal origin, universal evil-eye meaning or actual supernatural danger. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

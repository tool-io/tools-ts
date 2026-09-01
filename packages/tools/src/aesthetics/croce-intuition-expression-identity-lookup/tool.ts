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
          "Croce identifies aesthetic intuition with expression rather than mere sensory reception or technical copying.",
        reference: "Croce, Aesthetic 1902.",
        limitations:
          "A philosophical thesis, not proof that every intuition automatically becomes an artwork.",
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
      text: "Croce identifies aesthetic intuition with expression rather than mere sensory reception or technical copying.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/croce-intuition-expression-identity-lookup",
  title: "Croce Intuition Expression Identity Lookup",
  description:
    "Bounded offline reference: Croce identifies aesthetic intuition with expression rather than mere sensory reception or technical copying. Source: Croce, Aesthetic 1902. A philosophical thesis, not proof that every intuition automatically becomes an artwork. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

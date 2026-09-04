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
          "Vanishing hitchhiker stories share a recurring traveler, disappearance and later identification pattern.",
        reference: "Beardsley and Hankey, The Vanishing Hitchhiker; Brunvand.",
        limitations:
          "Variants and interpretation differ; no proof of ghosts or arbitrary automatic ATU/ML assignment.",
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
      text: "Vanishing hitchhiker stories share a recurring traveler, disappearance and later identification pattern.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/vanishing-hitchhiker-tale-type-lookup",
  title: "Vanishing Hitchhiker Tale Type Lookup",
  description:
    "Bounded offline reference: Vanishing hitchhiker stories share a recurring traveler, disappearance and later identification pattern. Source: Beardsley and Hankey, The Vanishing Hitchhiker; Brunvand. Variants and interpretation differ; no proof of ghosts or arbitrary automatic ATU/ML assignment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

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
          "Falling-portrait death-omen narratives interpret ordinary events through family or local belief.",
        reference: "Comparative superstition collections.",
        limitations:
          "No death prediction or evidence that a portrait causes harm.",
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
      text: "Falling-portrait death-omen narratives interpret ordinary events through family or local belief.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/portrait-falling-wall-death-omen-family-belief-lookup",
  title: "Portrait Falling Wall Death Omen Family Belief Lookup",
  description:
    "Bounded offline reference: Falling-portrait death-omen narratives interpret ordinary events through family or local belief. Source: Comparative superstition collections. No death prediction or evidence that a portrait causes harm. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

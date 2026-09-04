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
          "Cows can lie down for many behavioral/environmental reasons; the observation alone does not establish an approaching-rain forecast.",
        reference: "Animal-behavior and weather-lore interpretation resources.",
        limitations:
          "No universal prediction accuracy or single-cause biological mechanism is inferred.",
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
      text: "Cows can lie down for many behavioral/environmental reasons; the observation alone does not establish an approaching-rain forecast.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/cows-lying-down-rain-prediction-myth-verdict-context",
  title: "Cows Lying Down Rain Prediction Myth Verdict Context",
  description:
    "Bounded offline reference: Cows can lie down for many behavioral/environmental reasons; the observation alone does not establish an approaching-rain forecast. Source: Animal-behavior and weather-lore interpretation resources. No universal prediction accuracy or single-cause biological mechanism is inferred. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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

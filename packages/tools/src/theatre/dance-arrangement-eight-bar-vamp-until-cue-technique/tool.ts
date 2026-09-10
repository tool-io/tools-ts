import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "A vamp repeats a musical passage until a specified cue; eight bars is a chosen arrangement length, not a universal rule.",
        reference:
          "Musical-theatre orchestration and conductor score practice.",
        limitations:
          "Repeat points, cue authority and transitions must be independently established from the actual licensed score.",
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
      text: "A vamp repeats a musical passage until a specified cue; eight bars is a chosen arrangement length, not a universal rule.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/dance-arrangement-eight-bar-vamp-until-cue-technique",
  title: "Dance Arrangement Eight Bar Vamp Until Cue Technique",
  description:
    "Bounded offline reference: A vamp repeats a musical passage until a specified cue; eight bars is a chosen arrangement length, not a universal rule. Source: Musical-theatre orchestration and conductor score practice. Repeat points, cue authority and transitions must be independently established from the actual licensed score. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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

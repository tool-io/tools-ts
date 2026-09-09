import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Knee-over-pedal-spindle is a positional fitting convention, not an independently established universal biomechanical optimum.",
        reference: "Cycle fitting literature.",
        limitations:
          "Posture, crank position, task and comfort matter; plumb-line alignment alone does not establish a safe fit.",
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
      text: "Knee-over-pedal-spindle is a positional fitting convention, not an independently established universal biomechanical optimum.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/saddle-setback-plumb-line-kops-method-variance-debate",
  title: "Saddle Setback Plumb Line Kops Method Variance Debate",
  description:
    "Bounded offline reference: Knee-over-pedal-spindle is a positional fitting convention, not an independently established universal biomechanical optimum. Source: Cycle fitting literature. Posture, crank position, task and comfort matter; plumb-line alignment alone does not establish a safe fit. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

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
          "Self-selected cycling cadence and a measured economy optimum can differ with power, fatigue, task and training.",
        reference: "Cycling cadence/efficiency literature.",
        limitations:
          "No universally optimal RPMor inference that preferred cadence is medically unsuitable.",
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
      text: "Self-selected cycling cadence and a measured economy optimum can differ with power, fatigue, task and training.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/self-selected-versus-optimal-cadence-economy-tradeoff-note",
  title: "Self Selected Versus Optimal Cadence Economy Tradeoff Note",
  description:
    "Bounded offline reference: Self-selected cycling cadence and a measured economy optimum can differ with power, fatigue, task and training. Source: Cycling cadence/efficiency literature. No universally optimal RPMor inference that preferred cadence is medically unsuitable. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

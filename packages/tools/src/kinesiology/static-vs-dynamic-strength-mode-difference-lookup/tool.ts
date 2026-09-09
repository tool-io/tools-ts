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
          "Isometric strength is measured without the specified joint displacement; dynamic strength depends on movement, speed and contraction conditions.",
        reference: "Exercise testing methodology.",
        limitations:
          "Results are not interchangeable across angle, velocity, device or assessment protocol.",
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
      text: "Isometric strength is measured without the specified joint displacement; dynamic strength depends on movement, speed and contraction conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/static-vs-dynamic-strength-mode-difference-lookup",
  title: "Static vs Dynamic Strength Mode Difference Lookup",
  description:
    "Bounded offline reference: Isometric strength is measured without the specified joint displacement; dynamic strength depends on movement, speed and contraction conditions. Source: Exercise testing methodology. Results are not interchangeable across angle, velocity, device or assessment protocol. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

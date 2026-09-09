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
          "Post-exercise nutrition effects depend on total intake, timing of prior meals, training and recovery context, not a universal brief anabolic window.",
        reference: "Sports nutrition timing research.",
        limitations:
          "No individualized diet, dose or claim nutrient timing never matters.",
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
      text: "Post-exercise nutrition effects depend on total intake, timing of prior meals, training and recovery context, not a universal brief anabolic window.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/anabolic-window-post-workout-nutrition-myth-verdict-context",
  title: "Anabolic Window Post Workout Nutrition Myth Verdict Context",
  description:
    "Bounded offline reference: Post-exercise nutrition effects depend on total intake, timing of prior meals, training and recovery context, not a universal brief anabolic window. Source: Sports nutrition timing research. No individualized diet, dose or claim nutrient timing never matters. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

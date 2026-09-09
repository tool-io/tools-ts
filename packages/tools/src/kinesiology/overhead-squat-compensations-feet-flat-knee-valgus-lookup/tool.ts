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
          "Observed overhead-squat compensations depend on task, measurement, mobility, strategy and anatomy.",
        reference: "Functional movement assessment literature.",
        limitations:
          "Feet/knee motion alone does not identify a specific weak or tight muscle or diagnose pain.",
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
      text: "Observed overhead-squat compensations depend on task, measurement, mobility, strategy and anatomy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/overhead-squat-compensations-feet-flat-knee-valgus-lookup",
  title: "Overhead Squat Compensations Feet Flat Knee Valgus Lookup",
  description:
    "Bounded offline reference: Observed overhead-squat compensations depend on task, measurement, mobility, strategy and anatomy. Source: Functional movement assessment literature. Feet/knee motion alone does not identify a specific weak or tight muscle or diagnose pain. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

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
          "Markerless pose validation must compare the actual system, task, cameras, population and joint definitions with a suitable reference.",
        reference: "Markerless motion-capture validation research.",
        limitations:
          "Benchmark averages do not guarantee accuracy for every person, occlusion or clinical use.",
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
      text: "Markerless pose validation must compare the actual system, task, cameras, population and joint definitions with a suitable reference.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/markerless-pose-estimation-validation-accuracy-note-lookup",
  title: "Markerless Pose Estimation Validation Accuracy Note Lookup",
  description:
    "Bounded offline reference: Markerless pose validation must compare the actual system, task, cameras, population and joint definitions with a suitable reference. Source: Markerless motion-capture validation research. Benchmark averages do not guarantee accuracy for every person, occlusion or clinical use. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

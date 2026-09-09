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
          "Force-velocity profile comparisons need actual task-specific measurements and a validated model/reference.",
        reference: "Sprint/jump force-velocity profiling research.",
        limitations:
          "Horizontal/vertical imbalance labels are not medical diagnoses or proof a particular training intervention is needed.",
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
      text: "Force-velocity profile comparisons need actual task-specific measurements and a validated model/reference.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/force-velocity-profile-horizontal-vertical-imbalance-diagnosis",
  title: "Force Velocity Profile Horizontal Vertical Imbalance Diagnosis",
  description:
    "Bounded offline reference: Force-velocity profile comparisons need actual task-specific measurements and a validated model/reference. Source: Sprint/jump force-velocity profiling research. Horizontal/vertical imbalance labels are not medical diagnoses or proof a particular training intervention is needed. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

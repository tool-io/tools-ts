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
          "Joint moment arms are perpendicular distances from force line of action to the rotation axis; lever examples depend on the chosen system.",
        reference: "Biomechanics lever theory.",
        limitations:
          "A simple lever class is not a full muscle/joint force model or clinical finding.",
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
      text: "Joint moment arms are perpendicular distances from force line of action to the rotation axis; lever examples depend on the chosen system.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/moment-arm-joint-lever-class-examples-lookup",
  title: "Moment Arm Joint Lever Class Examples Lookup",
  description:
    "Bounded offline reference: Joint moment arms are perpendicular distances from force line of action to the rotation axis; lever examples depend on the chosen system. Source: Biomechanics lever theory. A simple lever class is not a full muscle/joint force model or clinical finding. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

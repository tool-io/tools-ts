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
          "Hurdle clearance coordinates approach, takeoff, lead/trail limb movement and landing under athlete/event constraints.",
        reference: "Hurdle biomechanics literature.",
        limitations:
          "No universal three-height rule or safe lead-knee/trail-leg geometry is assumed.",
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
      text: "Hurdle clearance coordinates approach, takeoff, lead/trail limb movement and landing under athlete/event constraints.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/hurdle-clearance-lead-knee-trail-leg-three-heights-rule",
  title: "Hurdle Clearance Lead Knee Trail Leg Three Heights Rule",
  description:
    "Bounded offline reference: Hurdle clearance coordinates approach, takeoff, lead/trail limb movement and landing under athlete/event constraints. Source: Hurdle biomechanics literature. No universal three-height rule or safe lead-knee/trail-leg geometry is assumed. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

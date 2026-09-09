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
          "Ski turn descriptions divide edge change, engagement and steering/pressure phases under particular analysis conventions.",
        reference: "Alpine-ski biomechanics literature.",
        limitations:
          "No universal steering angle or safe terrain/speed implied.",
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
      text: "Ski turn descriptions divide edge change, engagement and steering/pressure phases under particular analysis conventions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/skiing-turn-phase-edge-change-steering-angle-lookup",
  title: "Skiing Turn Phase Edge Change Steering Angle Lookup",
  description:
    "Bounded offline reference: Ski turn descriptions divide edge change, engagement and steering/pressure phases under particular analysis conventions. Source: Alpine-ski biomechanics literature. No universal steering angle or safe terrain/speed implied. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

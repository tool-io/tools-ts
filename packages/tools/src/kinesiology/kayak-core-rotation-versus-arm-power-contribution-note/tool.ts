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
          "Kayak stroke power involves torso, limb and boat interactions that require an actual measurement/model to partition.",
        reference: "Kayak biomechanics literature.",
        limitations:
          "No fixed core-versus-arm percentage or inferred muscle-force contribution from appearance.",
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
      text: "Kayak stroke power involves torso, limb and boat interactions that require an actual measurement/model to partition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/kayak-core-rotation-versus-arm-power-contribution-note",
  title: "Kayak Core Rotation Versus Arm Power Contribution Note",
  description:
    "Bounded offline reference: Kayak stroke power involves torso, limb and boat interactions that require an actual measurement/model to partition. Source: Kayak biomechanics literature. No fixed core-versus-arm percentage or inferred muscle-force contribution from appearance. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

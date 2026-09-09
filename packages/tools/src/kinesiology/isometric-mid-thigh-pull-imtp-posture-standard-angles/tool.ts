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
          "IMTPresults depend on actual joint angles, bar height, device, pre-tension, onset definition and force processing.",
        reference: "Isometric mid-thigh pull measurement literature.",
        limitations:
          "Protocol consistency matters; no universal posture angle or strength norm.",
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
      text: "IMTPresults depend on actual joint angles, bar height, device, pre-tension, onset definition and force processing.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/isometric-mid-thigh-pull-imtp-posture-standard-angles",
  title: "Isometric Mid Thigh Pull IMTP Posture Standard Angles",
  description:
    "Bounded offline reference: IMTPresults depend on actual joint angles, bar height, device, pre-tension, onset definition and force processing. Source: Isometric mid-thigh pull measurement literature. Protocol consistency matters; no universal posture angle or strength norm. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

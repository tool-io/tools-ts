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
          "Tibial accelerometer signals depend on mount site, alignment, attachment, sampling, filtering and soft-tissue motion.",
        reference: "Tibial-shock measurement validation literature.",
        limitations:
          "Distal-medial placement is a protocol convention, not one universal standard or direct bone stress.",
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
      text: "Tibial accelerometer signals depend on mount site, alignment, attachment, sampling, filtering and soft-tissue motion.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/tibial-shock-accelerometer-distal-medial-tibia-mount-standard",
  title: "Tibial Shock Accelerometer Distal Medial Tibia Mount Standard",
  description:
    "Bounded offline reference: Tibial accelerometer signals depend on mount site, alignment, attachment, sampling, filtering and soft-tissue motion. Source: Tibial-shock measurement validation literature. Distal-medial placement is a protocol convention, not one universal standard or direct bone stress. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

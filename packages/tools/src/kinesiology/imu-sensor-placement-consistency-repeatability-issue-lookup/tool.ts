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
          "IMU measurement repeatability depends on placement, alignment, attachment, calibration and processing consistency.",
        reference: "IMU biomechanics validation literature.",
        limitations:
          "Repeatable signals are not automatically accurate anatomical motion or diagnosis.",
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
      text: "IMU measurement repeatability depends on placement, alignment, attachment, calibration and processing consistency.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/imu-sensor-placement-consistency-repeatability-issue-lookup",
  title: "Imu Sensor Placement Consistency Repeatability Issue Lookup",
  description:
    "Bounded offline reference: IMU measurement repeatability depends on placement, alignment, attachment, calibration and processing consistency. Source: IMU biomechanics validation literature. Repeatable signals are not automatically accurate anatomical motion or diagnosis. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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

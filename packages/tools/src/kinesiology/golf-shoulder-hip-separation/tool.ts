import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly shoulderRotationDegrees: number;
  readonly hipRotationDegrees: number;
}>;
export type Output = Readonly<{
  readonly separationDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const raw =
    Math.abs(input.shoulderRotationDegrees - input.hipRotationDegrees) % 360;
  return { separationDegrees: Math.min(raw, 360 - raw) };
};
export const exampleInput = {
  shoulderRotationDegrees: 60,
  hipRotationDegrees: 30,
} satisfies Input;
export const exampleOutput = { separationDegrees: 30 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/golf-shoulder-hip-separation",
  title: "Golf Shoulder Hip Separation",
  description:
    "Calculate the smallest shoulder-to-hip rotational separation angle in a golf swing.",
  inputs: [
    {
      id: "shoulderRotationDegrees",
      label: "Shoulder rotation degrees",
      kind: "number",
    },
    { id: "hipRotationDegrees", label: "Hip rotation degrees", kind: "number" },
  ],
  outputs: [
    { id: "separationDegrees", label: "Separation degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      shoulderRotationDegrees: value.shoulderRotationDegrees as number,
      hipRotationDegrees: value.hipRotationDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

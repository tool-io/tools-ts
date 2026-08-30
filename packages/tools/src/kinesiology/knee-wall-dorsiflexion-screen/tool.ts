import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly kneeToWallDistanceCm: number;
  readonly minimumDistanceCm: number;
}>;
export type Output = Readonly<{
  readonly distanceShortfallCm: number;
  readonly meetsTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.kneeToWallDistanceCm < 0 || input.minimumDistanceCm < 0)
    simpleError(
      "kneeToWallDistanceCm",
      "Nonnegative ankle reach measurement and target required.",
    );
  return {
    distanceShortfallCm: Math.max(
      0,
      input.minimumDistanceCm - input.kneeToWallDistanceCm,
    ),
    meetsTarget: input.kneeToWallDistanceCm >= input.minimumDistanceCm,
  };
};
export const exampleInput = {
  kneeToWallDistanceCm: 8,
  minimumDistanceCm: 10,
} satisfies Input;
export const exampleOutput = {
  distanceShortfallCm: 2,
  meetsTarget: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/knee-wall-dorsiflexion-screen",
  title: "Knee Wall Dorsiflexion Screen",
  description:
    "Screen knee-to-wall ankle dorsiflexion against a supplied minimum distance.",
  inputs: [
    {
      id: "kneeToWallDistanceCm",
      label: "Knee to wall distance cm",
      kind: "number",
    },
    { id: "minimumDistanceCm", label: "Minimum distance cm", kind: "number" },
  ],
  outputs: [
    {
      id: "distanceShortfallCm",
      label: "Distance shortfall cm",
      kind: "number",
    },
    { id: "meetsTarget", label: "Meets target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      kneeToWallDistanceCm: value.kneeToWallDistanceCm as number,
      minimumDistanceCm: value.minimumDistanceCm as number,
    }),
});
export const run = tool.execute;
export default tool;

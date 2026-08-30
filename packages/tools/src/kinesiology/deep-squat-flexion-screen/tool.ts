import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly squatKneeFlexionDegrees: number;
  readonly minimumFlexionDegrees: number;
}>;
export type Output = Readonly<{
  readonly marginDegrees: number;
  readonly meetsTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.squatKneeFlexionDegrees < 0 || input.minimumFlexionDegrees < 0)
    simpleError(
      "squatKneeFlexionDegrees",
      "Nonnegative observed and minimum knee flexion angles required.",
    );
  return {
    marginDegrees: input.squatKneeFlexionDegrees - input.minimumFlexionDegrees,
    meetsTarget: input.squatKneeFlexionDegrees >= input.minimumFlexionDegrees,
  };
};
export const exampleInput = {
  squatKneeFlexionDegrees: 130,
  minimumFlexionDegrees: 120,
} satisfies Input;
export const exampleOutput = {
  marginDegrees: 10,
  meetsTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/deep-squat-flexion-screen",
  title: "Deep Squat Flexion Screen",
  description:
    "Compare observed deep-squat knee flexion to a caller-defined benchmark.",
  inputs: [
    {
      id: "squatKneeFlexionDegrees",
      label: "Squat knee flexion degrees",
      kind: "number",
    },
    {
      id: "minimumFlexionDegrees",
      label: "Minimum flexion degrees",
      kind: "number",
    },
  ],
  outputs: [
    { id: "marginDegrees", label: "Margin degrees", kind: "number" },
    { id: "meetsTarget", label: "Meets target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      squatKneeFlexionDegrees: value.squatKneeFlexionDegrees as number,
      minimumFlexionDegrees: value.minimumFlexionDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

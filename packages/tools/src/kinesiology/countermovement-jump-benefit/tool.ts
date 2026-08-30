import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly countermovementHeightCm: number;
  readonly squatJumpHeightCm: number;
}>;
export type Output = Readonly<{
  readonly heightGainCm: number;
  readonly percentBenefit: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.countermovementHeightCm < 0 || input.squatJumpHeightCm <= 0)
    simpleError(
      "squatJumpHeightCm",
      "Nonnegative countermovement height and positive squat jump height required.",
    );
  const heightGainCm = input.countermovementHeightCm - input.squatJumpHeightCm;
  return {
    heightGainCm,
    percentBenefit: (100 * heightGainCm) / input.squatJumpHeightCm,
  };
};
export const exampleInput = {
  countermovementHeightCm: 30,
  squatJumpHeightCm: 25,
} satisfies Input;
export const exampleOutput = {
  heightGainCm: 5,
  percentBenefit: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/countermovement-jump-benefit",
  title: "Countermovement Jump Benefit",
  description:
    "Quantify countermovement height benefit relative to a squat jump.",
  inputs: [
    {
      id: "countermovementHeightCm",
      label: "Countermovement height cm",
      kind: "number",
    },
    { id: "squatJumpHeightCm", label: "Squat jump height cm", kind: "number" },
  ],
  outputs: [
    { id: "heightGainCm", label: "Height gain cm", kind: "number" },
    { id: "percentBenefit", label: "Percent benefit", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      countermovementHeightCm: value.countermovementHeightCm as number,
      squatJumpHeightCm: value.squatJumpHeightCm as number,
    }),
});
export const run = tool.execute;
export default tool;

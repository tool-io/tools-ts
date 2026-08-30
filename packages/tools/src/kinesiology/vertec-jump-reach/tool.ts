import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly standingReachCm: number;
  readonly highestTouchCm: number;
}>;
export type Output = Readonly<{
  readonly jumpHeightCm: number;
  readonly jumpHeightM: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.standingReachCm < 0 || input.highestTouchCm < input.standingReachCm)
    simpleError(
      "highestTouchCm",
      "Touch height must not be below nonnegative standing reach.",
    );
  const jumpHeightCm = input.highestTouchCm - input.standingReachCm;
  return { jumpHeightCm, jumpHeightM: jumpHeightCm / 100 };
};
export const exampleInput = {
  standingReachCm: 220,
  highestTouchCm: 270,
} satisfies Input;
export const exampleOutput = {
  jumpHeightCm: 50,
  jumpHeightM: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/vertec-jump-reach",
  title: "Vertec Jump Reach",
  description:
    "Compute Vertec vertical-jump height from standing reach and highest touch.",
  inputs: [
    { id: "standingReachCm", label: "Standing reach cm", kind: "number" },
    { id: "highestTouchCm", label: "Highest touch cm", kind: "number" },
  ],
  outputs: [
    { id: "jumpHeightCm", label: "Jump height cm", kind: "number" },
    { id: "jumpHeightM", label: "Jump height m", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      standingReachCm: value.standingReachCm as number,
      highestTouchCm: value.highestTouchCm as number,
    }),
});
export const run = tool.execute;
export default tool;

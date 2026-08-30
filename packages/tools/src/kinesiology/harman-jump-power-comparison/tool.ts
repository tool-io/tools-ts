import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly jumpHeightCm: number;
  readonly bodyMassKg: number;
}>;
export type Output = Readonly<{
  readonly harmanPeakPowerW: number;
  readonly sayersPeakPowerW: number;
  readonly differenceW: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.jumpHeightCm <= 0 || input.bodyMassKg <= 0)
    simpleError(
      "jumpHeightCm",
      "Positive measured jump height and body mass required.",
    );
  const harmanPeakPowerW =
      61.9 * input.jumpHeightCm + 36 * input.bodyMassKg + 1822,
    sayersPeakPowerW =
      60.7 * input.jumpHeightCm + 45.3 * input.bodyMassKg - 2055;
  return {
    harmanPeakPowerW,
    sayersPeakPowerW,
    differenceW: harmanPeakPowerW - sayersPeakPowerW,
  };
};
export const exampleInput = {
  jumpHeightCm: 40,
  bodyMassKg: 70,
} satisfies Input;
export const exampleOutput = {
  harmanPeakPowerW: 6818,
  sayersPeakPowerW: 3544,
  differenceW: 3274,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/harman-jump-power-comparison",
  title: "Harman Jump Power Comparison",
  description:
    "Compare Harman and Sayers peak-power regression estimates for the same jump.",
  inputs: [
    { id: "jumpHeightCm", label: "Jump height cm", kind: "number" },
    { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
  ],
  outputs: [
    { id: "harmanPeakPowerW", label: "Harman peak power w", kind: "number" },
    { id: "sayersPeakPowerW", label: "Sayers peak power w", kind: "number" },
    { id: "differenceW", label: "Difference w", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      jumpHeightCm: value.jumpHeightCm as number,
      bodyMassKg: value.bodyMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;

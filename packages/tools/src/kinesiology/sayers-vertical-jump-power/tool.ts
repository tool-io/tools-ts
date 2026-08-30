import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly jumpHeightCm: number;
  readonly bodyMassKg: number;
}>;
export type Output = Readonly<{
  readonly estimatedPeakPowerW: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.jumpHeightCm <= 0 || input.bodyMassKg <= 0)
    simpleError("jumpHeightCm", "Positive jump height and body mass required.");
  return {
    estimatedPeakPowerW:
      60.7 * input.jumpHeightCm + 45.3 * input.bodyMassKg - 2055,
  };
};
export const exampleInput = {
  jumpHeightCm: 40,
  bodyMassKg: 70,
} satisfies Input;
export const exampleOutput = { estimatedPeakPowerW: 3544 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/sayers-vertical-jump-power",
  title: "Sayers Vertical Jump Power",
  description:
    "Estimate vertical-jump peak power with the published Sayers regression.",
  inputs: [
    { id: "jumpHeightCm", label: "Jump height cm", kind: "number" },
    { id: "bodyMassKg", label: "Body mass kg", kind: "number" },
  ],
  outputs: [
    {
      id: "estimatedPeakPowerW",
      label: "Estimated peak power w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      jumpHeightCm: value.jumpHeightCm as number,
      bodyMassKg: value.bodyMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;

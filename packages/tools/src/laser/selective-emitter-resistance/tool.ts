import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly emitterResistivityOhmMeters: number;
  readonly emitterThicknessMeters: number;
  readonly baselineSheetResistanceOhmsPerSquare: number;
}>;
export type Output = Readonly<{
  readonly emitterSheetResistanceOhmsPerSquare: number;
  readonly resistanceRatio: number;
  readonly reductionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.emitterThicknessMeters <= 0 ||
    input.baselineSheetResistanceOhmsPerSquare <= 0
  )
    simpleError(
      "emitterThicknessMeters",
      "Thickness and baseline resistance must be positive.",
      "invalid_baseline",
    );
  const emitterSheetResistanceOhmsPerSquare =
    input.emitterResistivityOhmMeters / input.emitterThicknessMeters;
  const resistanceRatio =
    emitterSheetResistanceOhmsPerSquare /
    input.baselineSheetResistanceOhmsPerSquare;
  return {
    emitterSheetResistanceOhmsPerSquare,
    resistanceRatio,
    reductionPercent: (1 - resistanceRatio) * 100,
  };
};

export const exampleInput = {
  emitterResistivityOhmMeters: 0.001,
  emitterThicknessMeters: 1e-5,
  baselineSheetResistanceOhmsPerSquare: 200,
} satisfies Input;
export const exampleOutput = {
  emitterSheetResistanceOhmsPerSquare: 100,
  resistanceRatio: 0.5,
  reductionPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      emitterResistivityOhmMeters: input.emitterResistivityOhmMeters as number,
      emitterThicknessMeters: input.emitterThicknessMeters as number,
      baselineSheetResistanceOhmsPerSquare:
        input.baselineSheetResistanceOhmsPerSquare as number,
    }),
  description:
    "Calculate selective-emitter sheet resistance and compare it with a baseline.",
  id: "laser/selective-emitter-resistance",
  inputs: [
    {
      id: "emitterResistivityOhmMeters",
      label: "Emitter resistivity",
      kind: "number",
      minimum: 0,
      unit: "Ω·m",
    },
    {
      id: "emitterThicknessMeters",
      label: "Emitter thickness",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "baselineSheetResistanceOhmsPerSquare",
      label: "Baseline sheet resistance",
      kind: "number",
      minimum: 0,
      unit: "Ω/□",
    },
  ],
  outputs: [
    {
      id: "emitterSheetResistanceOhmsPerSquare",
      label: "Emitter sheet resistance",
      kind: "number",
      minimum: 0,
      unit: "Ω/□",
    },
    {
      id: "resistanceRatio",
      label: "Emitter-to-baseline resistance ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "reductionPercent",
      label: "Sheet-resistance reduction",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Selective-Emitter Resistance",
});

export const run = tool.execute;
export default tool;

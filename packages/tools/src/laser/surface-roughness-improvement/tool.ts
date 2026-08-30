import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roughnessBefore: number;
  readonly roughnessAfter: number;
}>;
export type Output = Readonly<{
  readonly roughnessReduction: number;
  readonly improvementPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.roughnessBefore <= 0)
    simpleError(
      "roughnessBefore",
      "Initial roughness must be positive.",
      "invalid_baseline",
    );
  const roughnessReduction = input.roughnessBefore - input.roughnessAfter;
  return {
    roughnessReduction,
    improvementPercent: (roughnessReduction / input.roughnessBefore) * 100,
  };
};

export const exampleInput = {
  roughnessBefore: 10,
  roughnessAfter: 2,
} satisfies Input;
export const exampleOutput = {
  roughnessReduction: 8,
  improvementPercent: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roughnessBefore: input.roughnessBefore as number,
      roughnessAfter: input.roughnessAfter as number,
    }),
  description:
    "Calculate absolute and percentage surface-roughness improvement.",
  id: "laser/surface-roughness-improvement",
  inputs: [
    {
      id: "roughnessBefore",
      label: "Initial surface roughness",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
    {
      id: "roughnessAfter",
      label: "Final surface roughness",
      kind: "number",
      minimum: 0,
      unit: "length",
    },
  ],
  outputs: [
    {
      id: "roughnessReduction",
      label: "Absolute roughness reduction",
      kind: "number",
      unit: "length",
    },
    {
      id: "improvementPercent",
      label: "Roughness improvement",
      kind: "number",
      unit: "%",
    },
  ],
  title: "Surface-Roughness Improvement",
});

export const run = tool.execute;
export default tool;

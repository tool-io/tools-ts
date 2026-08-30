import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly effectiveReflectivity: number;
  readonly physicalPathLengthMeters: number;
}>;
export type Output = Readonly<{
  readonly pathEnhancementFactor: number;
  readonly effectivePathLengthMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.effectiveReflectivity >= 1)
    simpleError(
      "effectiveReflectivity",
      "Reflectivity must be less than one.",
      "singular_reflectivity",
    );
  const pathEnhancementFactor = 1 / (1 - input.effectiveReflectivity);
  return {
    pathEnhancementFactor,
    effectivePathLengthMeters:
      input.physicalPathLengthMeters * pathEnhancementFactor,
  };
};

export const exampleInput = {
  effectiveReflectivity: 0.99,
  physicalPathLengthMeters: 1,
} satisfies Input;
export const exampleOutput = {
  pathEnhancementFactor: 99.99999999999991,
  effectivePathLengthMeters: 99.99999999999991,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      effectiveReflectivity: input.effectiveReflectivity as number,
      physicalPathLengthMeters: input.physicalPathLengthMeters as number,
    }),
  description:
    "Calculate geometric cavity path enhancement from effective reflectivity.",
  id: "laser/cavity-path-enhancement",
  inputs: [
    {
      id: "effectiveReflectivity",
      label: "Effective cavity reflectivity",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "physicalPathLengthMeters",
      label: "Physical path length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "pathEnhancementFactor",
      label: "Path enhancement factor",
      kind: "number",
      minimum: 1,
    },
    {
      id: "effectivePathLengthMeters",
      label: "Effective path length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Cavity Path Enhancement",
});

export const run = tool.execute;
export default tool;

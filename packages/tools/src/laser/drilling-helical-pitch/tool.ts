import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly holeDepthMillimeters: number;
  readonly axialPitchPerRevolutionMillimeters: number;
  readonly orbitRadiusMillimeters: number;
}>;
export type Output = Readonly<{
  readonly revolutionCount: number;
  readonly helicalPathLengthMillimeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.axialPitchPerRevolutionMillimeters <= 0)
    simpleError(
      "axialPitchPerRevolutionMillimeters",
      "Axial pitch must be positive.",
      "invalid_pitch",
    );
  const revolutionCount =
    input.holeDepthMillimeters / input.axialPitchPerRevolutionMillimeters;
  const pathPerRevolution = Math.hypot(
    2 * Math.PI * input.orbitRadiusMillimeters,
    input.axialPitchPerRevolutionMillimeters,
  );
  return {
    revolutionCount,
    helicalPathLengthMillimeters: revolutionCount * pathPerRevolution,
  };
};

export const exampleInput = {
  holeDepthMillimeters: 10,
  axialPitchPerRevolutionMillimeters: 0.5,
  orbitRadiusMillimeters: 2,
} satisfies Input;
export const exampleOutput = {
  revolutionCount: 20,
  helicalPathLengthMillimeters: 251.52627728921664,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      holeDepthMillimeters: input.holeDepthMillimeters as number,
      axialPitchPerRevolutionMillimeters:
        input.axialPitchPerRevolutionMillimeters as number,
      orbitRadiusMillimeters: input.orbitRadiusMillimeters as number,
    }),
  description:
    "Calculate helical drilling revolution count and path length from depth, pitch, and orbit radius.",
  id: "laser/drilling-helical-pitch",
  inputs: [
    {
      id: "holeDepthMillimeters",
      label: "Hole depth",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "axialPitchPerRevolutionMillimeters",
      label: "Axial pitch per revolution",
      kind: "number",
      minimum: 0,
      unit: "mm/rev",
    },
    {
      id: "orbitRadiusMillimeters",
      label: "Orbit radius",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "revolutionCount",
      label: "Required revolutions",
      kind: "number",
      minimum: 0,
    },
    {
      id: "helicalPathLengthMillimeters",
      label: "Helical path length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  title: "Drilling Helical Pitch",
});

export const run = tool.execute;
export default tool;

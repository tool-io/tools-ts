import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fastAxisDivergenceRadians: number;
  readonly slowAxisDivergenceRadians: number;
  readonly targetBeamDiameterMillimeters: number;
}>;
export type Output = Readonly<{
  readonly fastAxisFocalLengthMillimeters: number;
  readonly slowAxisFocalLengthMillimeters: number;
  readonly focalLengthRatio: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.fastAxisDivergenceRadians <= 0 ||
    input.slowAxisDivergenceRadians <= 0 ||
    input.targetBeamDiameterMillimeters <= 0
  )
    simpleError(
      "fastAxisDivergenceRadians",
      "Divergences and target diameter must be positive.",
      "invalid_geometry",
    );
  const radius = input.targetBeamDiameterMillimeters / 2;
  const fastAxisFocalLengthMillimeters =
    radius / input.fastAxisDivergenceRadians;
  const slowAxisFocalLengthMillimeters =
    radius / input.slowAxisDivergenceRadians;
  return {
    fastAxisFocalLengthMillimeters,
    slowAxisFocalLengthMillimeters,
    focalLengthRatio:
      slowAxisFocalLengthMillimeters / fastAxisFocalLengthMillimeters,
  };
};

export const exampleInput = {
  fastAxisDivergenceRadians: 0.1,
  slowAxisDivergenceRadians: 0.02,
  targetBeamDiameterMillimeters: 10,
} satisfies Input;
export const exampleOutput = {
  fastAxisFocalLengthMillimeters: 50,
  slowAxisFocalLengthMillimeters: 250,
  focalLengthRatio: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fastAxisDivergenceRadians: input.fastAxisDivergenceRadians as number,
      slowAxisDivergenceRadians: input.slowAxisDivergenceRadians as number,
      targetBeamDiameterMillimeters:
        input.targetBeamDiameterMillimeters as number,
    }),
  description:
    "Estimate separate fast- and slow-axis collimator focal lengths from divergence and target diameter.",
  id: "laser/astigmatic-collimator-design",
  inputs: [
    {
      id: "fastAxisDivergenceRadians",
      label: "Fast-axis half divergence",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "slowAxisDivergenceRadians",
      label: "Slow-axis half divergence",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "targetBeamDiameterMillimeters",
      label: "Target collimated beam diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "fastAxisFocalLengthMillimeters",
      label: "Fast-axis focal length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "slowAxisFocalLengthMillimeters",
      label: "Slow-axis focal length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "focalLengthRatio",
      label: "Slow-to-fast focal ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Astigmatic Collimator Design",
});

export const run = tool.execute;
export default tool;

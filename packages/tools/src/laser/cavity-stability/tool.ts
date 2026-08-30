import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cavityLengthMeters: number;
  readonly firstMirrorRadiusMeters: number;
  readonly secondMirrorRadiusMeters: number;
}>;
export type Output = Readonly<{
  readonly firstGParameter: number;
  readonly secondGParameter: number;
  readonly stabilityProduct: number;
  readonly stable: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.firstMirrorRadiusMeters === 0 ||
    input.secondMirrorRadiusMeters === 0
  )
    simpleError(
      "firstMirrorRadiusMeters",
      "Mirror radii must be nonzero.",
      "invalid_radius",
    );
  const firstGParameter =
    1 - input.cavityLengthMeters / input.firstMirrorRadiusMeters;
  const secondGParameter =
    1 - input.cavityLengthMeters / input.secondMirrorRadiusMeters;
  const stabilityProduct = firstGParameter * secondGParameter;
  return {
    firstGParameter,
    secondGParameter,
    stabilityProduct,
    stable: stabilityProduct > 0 && stabilityProduct < 1,
  };
};

export const exampleInput = {
  cavityLengthMeters: 1,
  firstMirrorRadiusMeters: 2,
  secondMirrorRadiusMeters: 2,
} satisfies Input;
export const exampleOutput = {
  firstGParameter: 0.5,
  secondGParameter: 0.5,
  stabilityProduct: 0.25,
  stable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cavityLengthMeters: input.cavityLengthMeters as number,
      firstMirrorRadiusMeters: input.firstMirrorRadiusMeters as number,
      secondMirrorRadiusMeters: input.secondMirrorRadiusMeters as number,
    }),
  description:
    "Calculate two-mirror cavity g parameters and geometric stability.",
  id: "laser/cavity-stability",
  inputs: [
    {
      id: "cavityLengthMeters",
      label: "Mirror separation",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "firstMirrorRadiusMeters",
      label: "First mirror radius",
      kind: "number",
      unit: "m",
    },
    {
      id: "secondMirrorRadiusMeters",
      label: "Second mirror radius",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "firstGParameter",
      label: "First cavity g parameter",
      kind: "number",
    },
    {
      id: "secondGParameter",
      label: "Second cavity g parameter",
      kind: "number",
    },
    {
      id: "stabilityProduct",
      label: "Cavity stability product",
      kind: "number",
    },
    { id: "stable", label: "Geometrically stable cavity", kind: "boolean" },
  ],
  title: "Cavity Stability",
});

export const run = tool.execute;
export default tool;

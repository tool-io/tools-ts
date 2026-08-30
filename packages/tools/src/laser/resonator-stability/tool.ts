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
  readonly gProduct: number;
  readonly stable: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cavityLengthMeters <= 0 ||
    input.firstMirrorRadiusMeters === 0 ||
    input.secondMirrorRadiusMeters === 0
  )
    simpleError(
      "cavityLengthMeters",
      "Length must be positive and mirror radii must be nonzero.",
      "invalid_geometry",
    );
  const firstGParameter =
    1 - input.cavityLengthMeters / input.firstMirrorRadiusMeters;
  const secondGParameter =
    1 - input.cavityLengthMeters / input.secondMirrorRadiusMeters;
  const gProduct = firstGParameter * secondGParameter;
  return {
    firstGParameter,
    secondGParameter,
    gProduct,
    stable: gProduct > 0 && gProduct < 1,
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
  gProduct: 0.25,
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
    "Calculate two-mirror resonator g parameters and test the strict stability interval.",
  id: "laser/resonator-stability",
  inputs: [
    {
      id: "cavityLengthMeters",
      label: "Cavity length",
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
    { id: "firstGParameter", label: "First g parameter", kind: "number" },
    { id: "secondGParameter", label: "Second g parameter", kind: "number" },
    { id: "gProduct", label: "G-parameter product", kind: "number" },
    { id: "stable", label: "Stable resonator", kind: "boolean" },
  ],
  title: "Resonator Stability",
});

export const run = tool.execute;
export default tool;

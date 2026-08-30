import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly refractiveIndexStructureConstant: number;
  readonly wavelengthMeters: number;
  readonly pathLengthMeters: number;
  readonly strongScintillationThreshold: number;
}>;
export type Output = Readonly<{
  readonly rytovVariance: number;
  readonly regime: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0)
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  const waveNumber = (2 * Math.PI) / input.wavelengthMeters;
  const rytovVariance =
    1.23 *
    input.refractiveIndexStructureConstant *
    waveNumber ** (7 / 6) *
    input.pathLengthMeters ** (11 / 6);
  return {
    rytovVariance,
    regime:
      rytovVariance >= input.strongScintillationThreshold ? "strong" : "weak",
  };
};

export const exampleInput = {
  refractiveIndexStructureConstant: 1e-14,
  wavelengthMeters: 1e-6,
  pathLengthMeters: 1000,
  strongScintillationThreshold: 1,
} satisfies Input;
export const exampleOutput = {
  rytovVariance: 0.3319823217262583,
  regime: "weak",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      refractiveIndexStructureConstant:
        input.refractiveIndexStructureConstant as number,
      wavelengthMeters: input.wavelengthMeters as number,
      pathLengthMeters: input.pathLengthMeters as number,
      strongScintillationThreshold:
        input.strongScintillationThreshold as number,
    }),
  description:
    "Calculate plane-wave Rytov variance and classify it with a caller-supplied threshold.",
  id: "laser/rytov-variance",
  inputs: [
    {
      id: "refractiveIndexStructureConstant",
      label: "Cn²",
      kind: "number",
      minimum: 0,
      unit: "m^(-2/3)",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "pathLengthMeters",
      label: "Path length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "strongScintillationThreshold",
      label: "Strong-scintillation threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "rytovVariance",
      label: "Plane-wave Rytov variance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "regime",
      label: "Scintillation regime",
      kind: "string",
      enum: ["weak", "strong"],
    },
  ],
  title: "Rytov Variance",
});

export const run = tool.execute;
export default tool;

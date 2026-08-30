import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FeRamRemnantPolarizationInput = Readonly<{
  readonly remanentCoulombs: number;
  readonly electrodeSquareMeters: number;
}>;
export type FeRamRemnantPolarizationOutput = Readonly<{
  readonly polarizationCoulombsPerSquareMeter: number;
}>;

export const calculateFeRamRemnantPolarization = (
  x: FeRamRemnantPolarizationInput,
): FeRamRemnantPolarizationOutput => {
  if (!Number.isFinite(x.remanentCoulombs) || x.remanentCoulombs < 0)
    simpleError("remanentCoulombs", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.electrodeSquareMeters) || x.electrodeSquareMeters < 0)
    simpleError("electrodeSquareMeters", "Provide a finite number at least 0.");
  const polarizationCoulombsPerSquareMeter =
    x.remanentCoulombs / x.electrodeSquareMeters;
  if (!Number.isFinite(polarizationCoulombsPerSquareMeter))
    simpleError(
      "polarizationCoulombsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    polarizationCoulombsPerSquareMeter: Object.is(
      polarizationCoulombsPerSquareMeter,
      -0,
    )
      ? 0
      : polarizationCoulombsPerSquareMeter,
  };
};

export const example = {
  input: { remanentCoulombs: 1e-8, electrodeSquareMeters: 0.000001 },
  output: { polarizationCoulombsPerSquareMeter: 0.01 },
} satisfies ToolExample<
  FeRamRemnantPolarizationInput,
  FeRamRemnantPolarizationOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/fe-ram-remnant-polarization",
  title: "Fe Ram Remnant Polarization",
  description:
    "Remanent ferroelectric polarization magnitude from switched remanent charge and electrode area.",
  inputs: [
    {
      id: "remanentCoulombs",
      kind: "number",
      label: "Remanent Coulombs",
      unit: "C",
      minimum: 0,
    },
    {
      id: "electrodeSquareMeters",
      kind: "number",
      label: "Electrode Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "polarizationCoulombsPerSquareMeter",
      kind: "number",
      label: "Polarization Coulombs Per Square Meter",
      unit: "C/m²",
    },
  ],
  calculate: (input) =>
    calculateFeRamRemnantPolarization({
      remanentCoulombs: input.remanentCoulombs as number,
      electrodeSquareMeters: input.electrodeSquareMeters as number,
    }),
});
export const feRamRemnantPolarizationTool = tool;
export const runFeRamRemnantPolarization = tool.execute;
export default tool;

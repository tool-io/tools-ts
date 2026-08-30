import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MassLawTransmissionLossInput = Readonly<{
  readonly surfaceMassKgPerSquareMeter: number;
  readonly frequencyHertz: number;
}>;
export type MassLawTransmissionLossOutput = Readonly<{
  readonly lossDecibels: number;
}>;

export const calculateMassLawTransmissionLoss = (
  x: MassLawTransmissionLossInput,
): MassLawTransmissionLossOutput => {
  if (
    !Number.isFinite(x.surfaceMassKgPerSquareMeter) ||
    x.surfaceMassKgPerSquareMeter <= 0
  )
    simpleError(
      "surfaceMassKgPerSquareMeter",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz <= 0)
    simpleError("frequencyHertz", "Provide a finite positive number.");
  const lossDecibels =
    20 * Math.log10(x.surfaceMassKgPerSquareMeter * x.frequencyHertz) - 47;
  if (!Number.isFinite(lossDecibels))
    simpleError(
      "lossDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lossDecibels: Object.is(lossDecibels, -0) ? 0 : lossDecibels };
};

export const example = {
  input: {
    surfaceMassKgPerSquareMeter: 10,
    frequencyHertz: 1000,
  },
  output: { lossDecibels: 33 },
} satisfies ToolExample<
  MassLawTransmissionLossInput,
  MassLawTransmissionLossOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/mass-law-transmission-loss",
  title: "Mass Law Transmission Loss",
  description:
    "Approximate random-incidence mass-law transmission loss in dB for a thin homogeneous panel below coincidence: 20log10(surface mass × frequency) −47.",
  inputs: [
    {
      id: "surfaceMassKgPerSquareMeter",
      kind: "number",
      label: "Surface Mass Kg Per Square Meter",
      unit: "kg/m2",
      minimum: 0,
    },
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lossDecibels", kind: "number", label: "Loss Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateMassLawTransmissionLoss({
      surfaceMassKgPerSquareMeter: input.surfaceMassKgPerSquareMeter as number,
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const massLawTransmissionLossTool = tool;
export const runMassLawTransmissionLoss = tool.execute;
export default tool;

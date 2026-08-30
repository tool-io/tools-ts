import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AirAbsorptionLossInput = Readonly<{
  readonly attenuationDecibelsPerMeter: number;
  readonly distanceMeters: number;
}>;
export type AirAbsorptionLossOutput = Readonly<{
  readonly lossDecibels: number;
}>;

export const calculateAirAbsorptionLoss = (
  x: AirAbsorptionLossInput,
): AirAbsorptionLossOutput => {
  if (
    !Number.isFinite(x.attenuationDecibelsPerMeter) ||
    x.attenuationDecibelsPerMeter < 0
  )
    simpleError(
      "attenuationDecibelsPerMeter",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.distanceMeters) || x.distanceMeters < 0)
    simpleError("distanceMeters", "Provide a finite nonnegative number.");
  const lossDecibels = x.attenuationDecibelsPerMeter * x.distanceMeters;
  if (!Number.isFinite(lossDecibels))
    simpleError(
      "lossDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lossDecibels: Object.is(lossDecibels, -0) ? 0 : lossDecibels };
};

export const example = {
  input: {
    attenuationDecibelsPerMeter: 0.01,
    distanceMeters: 100,
  },
  output: { lossDecibels: 1 },
} satisfies ToolExample<AirAbsorptionLossInput, AirAbsorptionLossOutput>;

export const tool = createSimpleTool({
  id: "acoustics/air-absorption-loss",
  title: "Air Absorption Loss",
  description:
    "Atmospheric attenuation in dB from a specified frequency-dependent attenuation coefficient and path distance.",
  inputs: [
    {
      id: "attenuationDecibelsPerMeter",
      kind: "number",
      label: "Attenuation Decibels Per Meter",
      unit: "dB/m",
      minimum: 0,
    },
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lossDecibels", kind: "number", label: "Loss Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateAirAbsorptionLoss({
      attenuationDecibelsPerMeter: input.attenuationDecibelsPerMeter as number,
      distanceMeters: input.distanceMeters as number,
    }),
});
export const airAbsorptionLossTool = tool;
export const runAirAbsorptionLoss = tool.execute;
export default tool;

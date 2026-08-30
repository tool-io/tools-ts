import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TissueAttenuationFrequencyLossInput = Readonly<{
  readonly coefficientDbPerCmMhz: number;
  readonly frequencyMegahertz: number;
  readonly oneWayDepthCentimeters: number;
}>;
export type TissueAttenuationFrequencyLossOutput = Readonly<{
  readonly roundTripLossDecibels: number;
}>;

export const calculateTissueAttenuationFrequencyLoss = (
  x: TissueAttenuationFrequencyLossInput,
): TissueAttenuationFrequencyLossOutput => {
  if (!Number.isFinite(x.coefficientDbPerCmMhz) || x.coefficientDbPerCmMhz < 0)
    simpleError(
      "coefficientDbPerCmMhz",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.frequencyMegahertz) || x.frequencyMegahertz <= 0)
    simpleError("frequencyMegahertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.oneWayDepthCentimeters) ||
    x.oneWayDepthCentimeters < 0
  )
    simpleError(
      "oneWayDepthCentimeters",
      "Provide a finite nonnegative number.",
    );
  const roundTripLossDecibels =
    2 *
    x.coefficientDbPerCmMhz *
    x.frequencyMegahertz *
    x.oneWayDepthCentimeters;
  if (!Number.isFinite(roundTripLossDecibels))
    simpleError(
      "roundTripLossDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    roundTripLossDecibels: Object.is(roundTripLossDecibels, -0)
      ? 0
      : roundTripLossDecibels,
  };
};

export const example = {
  input: {
    coefficientDbPerCmMhz: 0.5,
    frequencyMegahertz: 2,
    oneWayDepthCentimeters: 5,
  },
  output: { roundTripLossDecibels: 10 },
} satisfies ToolExample<
  TissueAttenuationFrequencyLossInput,
  TissueAttenuationFrequencyLossOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/tissue-attenuation-frequency-loss",
  title: "Tissue Attenuation Frequency Loss",
  description:
    "Pulse-echo attenuation in dB from a specified tissue coefficient, transducer frequency, and one-way depth.",
  inputs: [
    {
      id: "coefficientDbPerCmMhz",
      kind: "number",
      label: "Coefficient Db Per Cm Mhz",
      unit: "dB/cm/MHz",
      minimum: 0,
    },
    {
      id: "frequencyMegahertz",
      kind: "number",
      label: "Frequency Megahertz",
      unit: "MHz",
      minimum: 0,
    },
    {
      id: "oneWayDepthCentimeters",
      kind: "number",
      label: "One Way Depth Centimeters",
      unit: "cm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "roundTripLossDecibels",
      kind: "number",
      label: "Round Trip Loss Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateTissueAttenuationFrequencyLoss({
      coefficientDbPerCmMhz: input.coefficientDbPerCmMhz as number,
      frequencyMegahertz: input.frequencyMegahertz as number,
      oneWayDepthCentimeters: input.oneWayDepthCentimeters as number,
    }),
});
export const tissueAttenuationFrequencyLossTool = tool;
export const runTissueAttenuationFrequencyLoss = tool.execute;
export default tool;

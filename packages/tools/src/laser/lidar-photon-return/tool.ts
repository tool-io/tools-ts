import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pulseEnergyJoules: number;
  readonly wavelengthMeters: number;
  readonly systemTransmission: number;
  readonly targetCrossSectionM2: number;
  readonly receiverAreaM2: number;
  readonly rangeMeters: number;
}>;
export type Output = Readonly<{
  readonly launchedPhotons: number;
  readonly receivedPhotons: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.wavelengthMeters <= 0 || input.rangeMeters <= 0)
    simpleError(
      "rangeMeters",
      "Wavelength and range must be positive.",
      "invalid_geometry",
    );
  const launchedPhotons =
    (input.pulseEnergyJoules * input.wavelengthMeters) /
    (6.62607015e-34 * 299792458);
  const spreading = 4 * Math.PI * input.rangeMeters ** 2;
  return {
    launchedPhotons,
    receivedPhotons:
      (launchedPhotons *
        input.systemTransmission *
        input.targetCrossSectionM2 *
        input.receiverAreaM2) /
      (spreading * spreading),
  };
};

export const exampleInput = {
  pulseEnergyJoules: 1.9864458571489286e-25,
  wavelengthMeters: 1,
  systemTransmission: 1,
  targetCrossSectionM2: 12.566370614359172,
  receiverAreaM2: 12.566370614359172,
  rangeMeters: 1,
} satisfies Input;
export const exampleOutput = {
  launchedPhotons: 1,
  receivedPhotons: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pulseEnergyJoules: input.pulseEnergyJoules as number,
      wavelengthMeters: input.wavelengthMeters as number,
      systemTransmission: input.systemTransmission as number,
      targetCrossSectionM2: input.targetCrossSectionM2 as number,
      receiverAreaM2: input.receiverAreaM2 as number,
      rangeMeters: input.rangeMeters as number,
    }),
  description:
    "Estimate monostatic lidar received photons from pulse energy and geometric spreading.",
  id: "laser/lidar-photon-return",
  inputs: [
    {
      id: "pulseEnergyJoules",
      label: "Pulse energy",
      kind: "number",
      minimum: 0,
      unit: "J",
    },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "systemTransmission",
      label: "System transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "targetCrossSectionM2",
      label: "Target cross section",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "receiverAreaM2",
      label: "Receiver aperture area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "rangeMeters",
      label: "Target range",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "launchedPhotons",
      label: "Launched photons",
      kind: "number",
      minimum: 0,
    },
    {
      id: "receivedPhotons",
      label: "Expected received photons",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Lidar Photon Return",
});

export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly attenuationPerMeter: number;
  readonly minimumTransmissionFraction: number;
}>;
export type Output = Readonly<{
  readonly maximumOneWayDepthMeters: number;
  readonly maximumRoundTripDepthMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.attenuationPerMeter <= 0 || input.minimumTransmissionFraction <= 0)
    simpleError(
      "attenuationPerMeter",
      "Attenuation and minimum transmission must be positive.",
      "invalid_limits",
    );
  const path =
    -Math.log(input.minimumTransmissionFraction) / input.attenuationPerMeter;
  return {
    maximumOneWayDepthMeters: path,
    maximumRoundTripDepthMeters: path / 2,
  };
};

export const exampleInput = {
  attenuationPerMeter: 1,
  minimumTransmissionFraction: 0.1353352832366127,
} satisfies Input;
export const exampleOutput = {
  maximumOneWayDepthMeters: 2,
  maximumRoundTripDepthMeters: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      attenuationPerMeter: input.attenuationPerMeter as number,
      minimumTransmissionFraction: input.minimumTransmissionFraction as number,
    }),
  description:
    "Calculate bathymetric optical penetration depth from attenuation and detection threshold.",
  id: "laser/bathymetric-penetration",
  inputs: [
    {
      id: "attenuationPerMeter",
      label: "Water attenuation coefficient",
      kind: "number",
      minimum: 0,
      unit: "1/m",
    },
    {
      id: "minimumTransmissionFraction",
      label: "Minimum detectable transmission",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "maximumOneWayDepthMeters",
      label: "Maximum one-way depth",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "maximumRoundTripDepthMeters",
      label: "Maximum round-trip depth",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Bathymetric Penetration",
});

export const run = tool.execute;
export default tool;

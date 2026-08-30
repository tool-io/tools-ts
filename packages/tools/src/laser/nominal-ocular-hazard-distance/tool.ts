import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly beamPowerWatts: number;
  readonly beamDiameterMeters: number;
  readonly divergenceRadians: number;
  readonly permissibleIrradianceWPerM2: number;
}>;
export type Output = Readonly<{
  readonly nohdMeters: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.divergenceRadians <= 0 || input.permissibleIrradianceWPerM2 <= 0)
    simpleError(
      "divergenceRadians",
      "Divergence and permissible irradiance must be positive.",
      "invalid_denominator",
    );
  const hazardRadius = Math.sqrt(
    input.beamPowerWatts / (Math.PI * input.permissibleIrradianceWPerM2),
  );
  return {
    nohdMeters: Math.max(
      0,
      (hazardRadius - input.beamDiameterMeters / 2) / input.divergenceRadians,
    ),
  };
};

export const exampleInput = {
  beamPowerWatts: 1,
  beamDiameterMeters: 0.001,
  divergenceRadians: 0.001,
  permissibleIrradianceWPerM2: 10,
} satisfies Input;
export const exampleOutput = { nohdMeters: 177.9124116152771 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      beamPowerWatts: input.beamPowerWatts as number,
      beamDiameterMeters: input.beamDiameterMeters as number,
      divergenceRadians: input.divergenceRadians as number,
      permissibleIrradianceWPerM2: input.permissibleIrradianceWPerM2 as number,
    }),
  description:
    "Estimate nominal ocular hazard distance with a simple expanding circular-beam irradiance model.",
  id: "laser/nominal-ocular-hazard-distance",
  inputs: [
    {
      id: "beamPowerWatts",
      label: "Beam power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "beamDiameterMeters",
      label: "Exit beam diameter",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "divergenceRadians",
      label: "Full-angle divergence",
      kind: "number",
      minimum: 0,
      unit: "rad",
    },
    {
      id: "permissibleIrradianceWPerM2",
      label: "Permissible irradiance",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  outputs: [
    {
      id: "nohdMeters",
      label: "Nominal ocular hazard distance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  title: "Nominal Ocular Hazard Distance",
});

export const run = tool.execute;
export default tool;

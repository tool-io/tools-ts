import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CementVolumeRequiredInput = {
  readonly holeDiameterMetres: number;
  readonly casingOuterDiameterMetres: number;
  readonly openHoleLengthMetres: number;
  readonly excessPercent?: number;
};

export type CementVolumeRequiredOutput = {
  readonly annularCapacityLitresPerMetre: number;
  readonly theoreticalAnnularVolumeCubicMetres: number;
  readonly cementSlurryVolumeCubicMetres: number;
};

export const calculateCementVolumeRequired = (
  input: CementVolumeRequiredInput,
): CementVolumeRequiredOutput => {
  const excess = input.excessPercent ?? 50;
  if (!(input.casingOuterDiameterMetres > 0))
    return simpleError(
      "casingOuterDiameterMetres",
      "Casing outer diameter must be greater than zero.",
      "invalid_geometry",
    );
  if (!(input.holeDiameterMetres > input.casingOuterDiameterMetres))
    return simpleError(
      "holeDiameterMetres",
      "Hole diameter must be greater than the casing outer diameter.",
      "invalid_geometry",
    );
  if (!(input.openHoleLengthMetres > 0))
    return simpleError(
      "openHoleLengthMetres",
      "Open-hole length must be greater than zero.",
      "invalid_length",
    );
  if (!(excess >= 0))
    return simpleError(
      "excessPercent",
      "Excess cannot be negative.",
      "invalid_excess",
    );
  const capacity =
    (Math.PI / 4) *
    (input.holeDiameterMetres ** 2 - input.casingOuterDiameterMetres ** 2) *
    1000;
  const theoretical = (capacity / 1000) * input.openHoleLengthMetres;
  return {
    annularCapacityLitresPerMetre: capacity,
    theoreticalAnnularVolumeCubicMetres: theoretical,
    cementSlurryVolumeCubicMetres: theoretical * (1 + excess / 100),
  };
};

export const cementVolumeRequiredExample = {
  input: {
    holeDiameterMetres: 0.31115,
    casingOuterDiameterMetres: 0.1778,
    openHoleLengthMetres: 1500,
    excessPercent: 50,
  },
  output: {
    annularCapacityLitresPerMetre: 51.20912460629086,
    theoreticalAnnularVolumeCubicMetres: 76.81368690943629,
    cementSlurryVolumeCubicMetres: 115.22053036415443,
  },
} satisfies ToolExample<CementVolumeRequiredInput, CementVolumeRequiredOutput>;

export const cementVolumeRequiredTool = createSimpleTool({
  id: "geology/cement-volume-required",
  title: "Cement Volume Required Calculator",
  description:
    "Compute the annular capacity and cement slurry volume required to cover a cased interval, including excess.",
  inputs: [
    {
      description: "Borehole diameter in metres.",
      id: "holeDiameterMetres",
      kind: "number",
      label: "Hole diameter",
    },
    {
      description: "Casing outer diameter in metres.",
      id: "casingOuterDiameterMetres",
      kind: "number",
      label: "Casing OD",
    },
    {
      description: "Open-hole length to cement in metres.",
      id: "openHoleLengthMetres",
      kind: "number",
      label: "Interval length",
    },
    {
      default: 50,
      description: "Excess slurry allowance in percent.",
      id: "excessPercent",
      kind: "number",
      label: "Excess",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Annular capacity in litres per metre of hole.",
      id: "annularCapacityLitresPerMetre",
      kind: "number",
      label: "Capacity",
    },
    {
      description: "Theoretical annular volume without excess in cubic metres.",
      id: "theoreticalAnnularVolumeCubicMetres",
      kind: "number",
      label: "Annular volume",
    },
    {
      description: "Cement slurry volume including excess in cubic metres.",
      id: "cementSlurryVolumeCubicMetres",
      kind: "number",
      label: "Cement volume",
    },
  ],
  calculate: (input) =>
    calculateCementVolumeRequired(
      input as unknown as CementVolumeRequiredInput,
    ),
});

export const runCementVolumeRequired = cementVolumeRequiredTool.execute;
export default cementVolumeRequiredTool;

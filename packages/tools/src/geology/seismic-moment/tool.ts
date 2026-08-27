import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeismicMomentInput = {
  readonly shearModulusPa?: number;
  readonly ruptureAreaSquareMeters: number;
  readonly averageSlipMeters: number;
};

export type SeismicMomentOutput = {
  readonly seismicMomentNewtonMeters: number;
};

export const calculateSeismicMoment = (
  input: SeismicMomentInput,
): SeismicMomentOutput => {
  const shearModulusPa = input.shearModulusPa ?? 30000000000;
  if (!(shearModulusPa > 0))
    simpleError(
      "shearModulusPa",
      "Shear modulus must be greater than zero.",
      "invalid_modulus",
    );
  if (!(input.ruptureAreaSquareMeters > 0))
    simpleError(
      "ruptureAreaSquareMeters",
      "Rupture area must be greater than zero.",
      "invalid_area",
    );
  if (!(input.averageSlipMeters > 0))
    simpleError(
      "averageSlipMeters",
      "Average slip must be greater than zero.",
      "invalid_slip",
    );
  return {
    seismicMomentNewtonMeters:
      shearModulusPa * input.ruptureAreaSquareMeters * input.averageSlipMeters,
  };
};

export const seismicMomentExample = {
  input: {
    shearModulusPa: 30000000000,
    ruptureAreaSquareMeters: 500000000,
    averageSlipMeters: 1,
  },
  output: { seismicMomentNewtonMeters: 15000000000000000000 },
} satisfies ToolExample<SeismicMomentInput, SeismicMomentOutput>;

export const seismicMomentTool = createSimpleTool({
  id: "geology/seismic-moment",
  title: "Seismic Moment Calculator",
  description:
    "Seismic moment M0 = mu * A * D with rigidity in pascals, rupture area in square meters and average slip in meters; result in newton meters.",
  inputs: [
    {
      default: 30000000000,
      description:
        "Shear modulus (rigidity) in pascals; crustal average 30 GPa.",
      id: "shearModulusPa",
      kind: "number",
      label: "Shear modulus",
      minimum: 0,
    },
    {
      description: "Rupture area in square meters.",
      id: "ruptureAreaSquareMeters",
      kind: "number",
      label: "Rupture area",
      minimum: 0,
    },
    {
      description: "Average slip over the rupture in meters.",
      id: "averageSlipMeters",
      kind: "number",
      label: "Average slip",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Seismic moment in newton meters.",
      id: "seismicMomentNewtonMeters",
      kind: "number",
      label: "Seismic moment",
    },
  ],
  calculate: (input) =>
    calculateSeismicMoment(input as unknown as SeismicMomentInput),
});

export const runSeismicMoment = seismicMomentTool.execute;
export default seismicMomentTool;

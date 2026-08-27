import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GravityAnomalyBouguerInput = {
  readonly observedGravityMgal: number;
  readonly elevationM: number;
  readonly referenceGravityMgal: number;
  readonly reductionDensityKgPerM3?: number;
};

export type GravityAnomalyBouguerOutput = {
  readonly bouguerAnomalyMgal: number;
  readonly freeAirCorrectionMgal: number;
  readonly bouguerCorrectionMgal: number;
};

const FREE_AIR_GRADIENT_MGAL_PER_M = 0.3086;
const G_M3_PER_KG_S2 = 6.6743e-11;

export const calculateGravityAnomalyBouguer = (
  input: GravityAnomalyBouguerInput,
): GravityAnomalyBouguerOutput => {
  if (!(input.observedGravityMgal > 0))
    return simpleError(
      "observedGravityMgal",
      "Observed gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(input.referenceGravityMgal > 0))
    return simpleError(
      "referenceGravityMgal",
      "Reference (theoretical) gravity must be greater than zero.",
      "invalid_gravity",
    );
  if (!(input.elevationM >= 0))
    return simpleError(
      "elevationM",
      "Elevation above the datum must be non-negative for the land Bouguer reduction.",
      "invalid_elevation",
    );
  const densityKgPerM3 = input.reductionDensityKgPerM3 ?? 2670;
  if (!(densityKgPerM3 > 0))
    return simpleError(
      "reductionDensityKgPerM3",
      "Reduction density must be greater than zero.",
      "invalid_density",
    );
  const freeAirCorrectionMgal = FREE_AIR_GRADIENT_MGAL_PER_M * input.elevationM;
  const bouguerCorrectionMgal =
    (2 * Math.PI * G_M3_PER_KG_S2 * densityKgPerM3 * input.elevationM) / 1e-5;
  return {
    bouguerAnomalyMgal:
      input.observedGravityMgal -
      input.referenceGravityMgal +
      freeAirCorrectionMgal -
      bouguerCorrectionMgal,
    freeAirCorrectionMgal,
    bouguerCorrectionMgal,
  };
};

export const gravityAnomalyBouguerExample = {
  input: {
    observedGravityMgal: 979870.0,
    elevationM: 500,
    referenceGravityMgal: 980000.0,
    reductionDensityKgPerM3: 2670,
  },
  output: {
    bouguerAnomalyMgal: -31.68437803377114,
    freeAirCorrectionMgal: 154.29999999999998,
    bouguerCorrectionMgal: 55.98437803377112,
  },
} satisfies ToolExample<
  GravityAnomalyBouguerInput,
  GravityAnomalyBouguerOutput
>;

export const gravityAnomalyBouguerTool = createSimpleTool({
  id: "geology/gravity-anomaly-bouguer",
  title: "Gravity Anomaly Bouguer Calculator",
  description:
    "Land Bouguer anomaly in milligal: g_obs - g_ref + 0.3086 h - 2 pi G rho h, with elevation h in meters and reduction density rho in kilograms per cubic meter (default 2670 kg/m^3).",
  inputs: [
    {
      description: "Observed absolute gravity at the station in milligal.",
      id: "observedGravityMgal",
      kind: "number",
      label: "g obs",
      minimum: 0,
    },
    {
      description: "Station elevation above the datum in meters.",
      id: "elevationM",
      kind: "number",
      label: "Elevation",
      minimum: 0,
    },
    {
      description:
        "Theoretical (normal) gravity at the station latitude and datum in milligal.",
      id: "referenceGravityMgal",
      kind: "number",
      label: "g ref",
      minimum: 0,
    },
    {
      default: 2670,
      description: "Bouguer reduction density in kilograms per cubic meter.",
      id: "reductionDensityKgPerM3",
      kind: "number",
      label: "Density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Bouguer anomaly in milligal.",
      id: "bouguerAnomalyMgal",
      kind: "number",
      label: "Bouguer anomaly",
    },
    {
      description: "Free-air correction 0.3086 h in milligal.",
      id: "freeAirCorrectionMgal",
      kind: "number",
      label: "Free-air correction",
    },
    {
      description: "Infinite-slab Bouguer correction 2 pi G rho h in milligal.",
      id: "bouguerCorrectionMgal",
      kind: "number",
      label: "Bouguer correction",
    },
  ],
  calculate: (input) =>
    calculateGravityAnomalyBouguer(
      input as unknown as GravityAnomalyBouguerInput,
    ),
});

export const runGravityAnomalyBouguer = gravityAnomalyBouguerTool.execute;
export default gravityAnomalyBouguerTool;

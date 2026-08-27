import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GravityAnomalyFreeAirInput = {
  readonly observedGravityMgal: number;
  readonly elevationM: number;
  readonly referenceGravityMgal: number;
};

export type GravityAnomalyFreeAirOutput = {
  readonly freeAirAnomalyMgal: number;
  readonly freeAirCorrectionMgal: number;
};

const FREE_AIR_GRADIENT_MGAL_PER_M = 0.3086;

export const calculateGravityAnomalyFreeAir = (
  input: GravityAnomalyFreeAirInput,
): GravityAnomalyFreeAirOutput => {
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
      "Elevation above the datum must be non-negative for the land free-air reduction.",
      "invalid_elevation",
    );
  const freeAirCorrectionMgal = FREE_AIR_GRADIENT_MGAL_PER_M * input.elevationM;
  return {
    freeAirAnomalyMgal:
      input.observedGravityMgal -
      input.referenceGravityMgal +
      freeAirCorrectionMgal,
    freeAirCorrectionMgal,
  };
};

export const gravityAnomalyFreeAirExample = {
  input: {
    observedGravityMgal: 979870.0,
    elevationM: 500,
    referenceGravityMgal: 980000.0,
  },
  output: {
    freeAirAnomalyMgal: 24.299999999999983,
    freeAirCorrectionMgal: 154.29999999999998,
  },
} satisfies ToolExample<
  GravityAnomalyFreeAirInput,
  GravityAnomalyFreeAirOutput
>;

export const gravityAnomalyFreeAirTool = createSimpleTool({
  id: "geology/gravity-anomaly-free-air",
  title: "Gravity Anomaly Free Air Calculator",
  description:
    "Land free-air anomaly in milligal: g_obs - g_ref + 0.3086 h with station elevation h in meters and the standard free-air gradient of 0.3086 milligal per meter.",
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
  ],
  outputs: [
    {
      description: "Free-air anomaly in milligal.",
      id: "freeAirAnomalyMgal",
      kind: "number",
      label: "Free-air anomaly",
    },
    {
      description: "Free-air correction 0.3086 h in milligal.",
      id: "freeAirCorrectionMgal",
      kind: "number",
      label: "Free-air correction",
    },
  ],
  calculate: (input) =>
    calculateGravityAnomalyFreeAir(
      input as unknown as GravityAnomalyFreeAirInput,
    ),
});

export const runGravityAnomalyFreeAir = gravityAnomalyFreeAirTool.execute;
export default gravityAnomalyFreeAirTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ActiveEarthPressureInput = {
  readonly unitWeightKNPerM3?: number;
  readonly depthM?: number;
  readonly frictionAngleDeg?: number;
};

export type ActiveEarthPressureOutput = {
  readonly activePressureKPa: number;
};

export const calculateActiveEarthPressure = (
  input: ActiveEarthPressureInput,
): ActiveEarthPressureOutput => {
  const unitWeightKNPerM3 = input.unitWeightKNPerM3 ?? 18;
  const depthM = input.depthM ?? 5;
  const frictionAngleDeg = input.frictionAngleDeg ?? 30;
  if (!(unitWeightKNPerM3 > 0))
    simpleError(
      "unitWeightKNPerM3",
      "Unit weight must be greater than zero.",
      "invalid_unit_weight",
    );
  if (!(depthM >= 0))
    simpleError("depthM", "Depth must be non-negative.", "invalid_depth");
  if (!(frictionAngleDeg >= 0 && frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must be in the range [0, 90) degrees.",
      "invalid_friction_angle",
    );
  const sinPhi = Math.sin((frictionAngleDeg * Math.PI) / 180);
  const activeCoefficient = (1 - sinPhi) / (1 + sinPhi);
  return { activePressureKPa: activeCoefficient * unitWeightKNPerM3 * depthM };
};

export const activeEarthPressureExample = {
  input: { unitWeightKNPerM3: 18, depthM: 5, frictionAngleDeg: 30 },
  output: { activePressureKPa: 30 },
} satisfies ToolExample<ActiveEarthPressureInput, ActiveEarthPressureOutput>;

export const activeEarthPressureTool = createSimpleTool({
  id: "geology/active-earth-pressure",
  title: "Active Earth Pressure Calculator",
  description:
    "Rankine active lateral earth pressure sigma_a = Ka * gamma * z at a given depth behind a vertical wall with a level backfill.",
  inputs: [
    {
      default: 18,
      description: "Soil unit weight in kN/m³.",
      id: "unitWeightKNPerM3",
      kind: "number",
      label: "gamma",
    },
    {
      default: 5,
      description: "Depth below ground surface in metres.",
      id: "depthM",
      kind: "number",
      label: "z",
    },
    {
      default: 30,
      description: "Soil friction angle in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
    },
  ],
  outputs: [
    {
      description: "Active lateral earth pressure in kilopascals.",
      id: "activePressureKPa",
      kind: "number",
      label: "sigma_a",
      unit: "kPa",
    },
  ],
  calculate: (input) =>
    calculateActiveEarthPressure(input as unknown as ActiveEarthPressureInput),
});

export const runActiveEarthPressure = activeEarthPressureTool.execute;
export default activeEarthPressureTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PassiveEarthPressureInput = {
  readonly unitWeightKNPerM3?: number;
  readonly depthM?: number;
  readonly frictionAngleDeg?: number;
};

export type PassiveEarthPressureOutput = {
  readonly passivePressureKPa: number;
};

export const calculatePassiveEarthPressure = (
  input: PassiveEarthPressureInput,
): PassiveEarthPressureOutput => {
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
  const passiveCoefficient = (1 + sinPhi) / (1 - sinPhi);
  return {
    passivePressureKPa: passiveCoefficient * unitWeightKNPerM3 * depthM,
  };
};

export const passiveEarthPressureExample = {
  input: { unitWeightKNPerM3: 18, depthM: 5, frictionAngleDeg: 30 },
  output: { passivePressureKPa: 270 },
} satisfies ToolExample<PassiveEarthPressureInput, PassiveEarthPressureOutput>;

export const passiveEarthPressureTool = createSimpleTool({
  id: "geology/passive-earth-pressure",
  title: "Passive Earth Pressure Calculator",
  description:
    "Rankine passive lateral earth pressure sigma_p = Kp * gamma * z at a given depth in front of a vertical wall with a level backfill.",
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
      description: "Passive lateral earth pressure in kilopascals.",
      id: "passivePressureKPa",
      kind: "number",
      label: "sigma_p",
      unit: "kPa",
    },
  ],
  calculate: (input) =>
    calculatePassiveEarthPressure(
      input as unknown as PassiveEarthPressureInput,
    ),
});

export const runPassiveEarthPressure = passiveEarthPressureTool.execute;
export default passiveEarthPressureTool;

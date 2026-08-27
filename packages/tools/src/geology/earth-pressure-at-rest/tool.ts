import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const DEG = Math.PI / 180;

export type EarthPressureAtRestInput = {
  readonly effectiveVerticalStressKpa: number;
  readonly frictionAngleDeg: number;
};

export type EarthPressureAtRestOutput = {
  readonly koCoefficient: number;
  readonly horizontalEffectiveStressKpa: number;
};

export const calculateEarthPressureAtRest = (
  input: EarthPressureAtRestInput,
): EarthPressureAtRestOutput => {
  if (!(input.effectiveVerticalStressKpa > 0))
    simpleError(
      "effectiveVerticalStressKpa",
      "Effective vertical stress must be greater than zero.",
      "invalid_stress",
    );
  if (!(input.frictionAngleDeg >= 0 && input.frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must lie between 0 and 90 degrees.",
      "invalid_friction_angle",
    );
  const koCoefficient = 1 - Math.sin(input.frictionAngleDeg * DEG);
  return {
    koCoefficient,
    horizontalEffectiveStressKpa:
      koCoefficient * input.effectiveVerticalStressKpa,
  };
};

export const earthPressureAtRestExample = {
  input: { effectiveVerticalStressKpa: 100, frictionAngleDeg: 30 },
  output: { koCoefficient: 0.5, horizontalEffectiveStressKpa: 50 },
} satisfies ToolExample<EarthPressureAtRestInput, EarthPressureAtRestOutput>;

export const earthPressureAtRestTool = createSimpleTool({
  id: "geology/earth-pressure-at-rest",
  title: "Earth Pressure At Rest Calculator",
  description:
    "At-rest lateral earth pressure for a normally consolidated soil via Jaky K0 = 1 - sin(phi): horizontal effective stress sigma_h' = K0 * sigma_v'. Stress in kPa, angle in degrees.",
  inputs: [
    {
      description: "Effective vertical stress sigma_v' in kPa.",
      id: "effectiveVerticalStressKpa",
      kind: "number",
      label: "sigma v'",
      minimum: 0,
    },
    {
      description: "Effective friction angle phi in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "At-rest earth pressure coefficient K0, dimensionless.",
      id: "koCoefficient",
      kind: "number",
      label: "K0",
    },
    {
      description: "Horizontal effective stress sigma_h' in kPa.",
      id: "horizontalEffectiveStressKpa",
      kind: "number",
      label: "sigma h'",
    },
  ],
  calculate: (input) =>
    calculateEarthPressureAtRest(input as unknown as EarthPressureAtRestInput),
});

export const runEarthPressureAtRest = earthPressureAtRestTool.execute;
export default earthPressureAtRestTool;

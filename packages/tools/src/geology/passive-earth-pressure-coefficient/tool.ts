import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PassiveEarthPressureCoefficientInput = {
  readonly frictionAngleDeg: number;
};

export type PassiveEarthPressureCoefficientOutput = {
  readonly passiveCoefficient: number;
};

export const calculatePassiveEarthPressureCoefficient = (
  input: PassiveEarthPressureCoefficientInput,
): PassiveEarthPressureCoefficientOutput => {
  const { frictionAngleDeg } = input;
  if (!(frictionAngleDeg >= 0 && frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must be in the range [0, 90) degrees.",
      "invalid_friction_angle",
    );
  const sinPhi = Math.sin((frictionAngleDeg * Math.PI) / 180);
  return { passiveCoefficient: (1 + sinPhi) / (1 - sinPhi) };
};

export const passiveEarthPressureCoefficientExample = {
  input: { frictionAngleDeg: 30 },
  output: { passiveCoefficient: 3 },
} satisfies ToolExample<
  PassiveEarthPressureCoefficientInput,
  PassiveEarthPressureCoefficientOutput
>;

export const passiveEarthPressureCoefficientTool = createSimpleTool({
  id: "geology/passive-earth-pressure-coefficient",
  title: "Passive Earth Pressure Coefficient Calculator",
  description:
    "Rankine passive earth pressure coefficient Kp = (1 + sin phi) / (1 - sin phi) for a vertical wall and level backfill.",
  inputs: [
    {
      description: "Soil friction angle in degrees.",
      id: "frictionAngleDeg",
      kind: "number",
      label: "phi",
    },
  ],
  outputs: [
    {
      description: "Rankine passive earth pressure coefficient Kp.",
      id: "passiveCoefficient",
      kind: "number",
      label: "Kp",
    },
  ],
  calculate: (input) =>
    calculatePassiveEarthPressureCoefficient(
      input as unknown as PassiveEarthPressureCoefficientInput,
    ),
});

export const runPassiveEarthPressureCoefficient =
  passiveEarthPressureCoefficientTool.execute;
export default passiveEarthPressureCoefficientTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ActiveEarthPressureCoefficientInput = {
  readonly frictionAngleDeg: number;
};

export type ActiveEarthPressureCoefficientOutput = {
  readonly activeCoefficient: number;
};

export const calculateActiveEarthPressureCoefficient = (
  input: ActiveEarthPressureCoefficientInput,
): ActiveEarthPressureCoefficientOutput => {
  const { frictionAngleDeg } = input;
  if (!(frictionAngleDeg >= 0 && frictionAngleDeg < 90))
    simpleError(
      "frictionAngleDeg",
      "Friction angle must be in the range [0, 90) degrees.",
      "invalid_friction_angle",
    );
  const sinPhi = Math.sin((frictionAngleDeg * Math.PI) / 180);
  return { activeCoefficient: (1 - sinPhi) / (1 + sinPhi) };
};

export const activeEarthPressureCoefficientExample = {
  input: { frictionAngleDeg: 30 },
  output: { activeCoefficient: 0.3333333333333333 },
} satisfies ToolExample<
  ActiveEarthPressureCoefficientInput,
  ActiveEarthPressureCoefficientOutput
>;

export const activeEarthPressureCoefficientTool = createSimpleTool({
  id: "geology/active-earth-pressure-coefficient",
  title: "Active Earth Pressure Coefficient Calculator",
  description:
    "Rankine active earth pressure coefficient Ka = (1 - sin phi) / (1 + sin phi) for a vertical wall and level backfill.",
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
      description: "Rankine active earth pressure coefficient Ka.",
      id: "activeCoefficient",
      kind: "number",
      label: "Ka",
    },
  ],
  calculate: (input) =>
    calculateActiveEarthPressureCoefficient(
      input as unknown as ActiveEarthPressureCoefficientInput,
    ),
});

export const runActiveEarthPressureCoefficient =
  activeEarthPressureCoefficientTool.execute;
export default activeEarthPressureCoefficientTool;

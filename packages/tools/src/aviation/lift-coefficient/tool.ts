import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LiftCoefficientInput = {
  readonly liftLb: number;
  readonly dynamicPressurePsf: number;
  readonly wingAreaFt2: number;
};

export type LiftCoefficientOutput = {
  readonly liftCoefficient: number;
};

export const liftCoefficientExample = {
  input: {
    dynamicPressurePsf: 33.9,
    liftLb: 2400,
    wingAreaFt2: 174,
  },
  output: { liftCoefficient: 0.4068762079137423 },
} satisfies ToolExample<LiftCoefficientInput, LiftCoefficientOutput>;

export const calculateLiftCoefficient = (
  input: LiftCoefficientInput,
): LiftCoefficientOutput => {
  if (input.dynamicPressurePsf <= 0 || input.wingAreaFt2 <= 0)
    simpleError(
      "dynamicPressurePsf",
      "Dynamic pressure and wing area must be positive.",
      "invalid_input",
    );
  return {
    liftCoefficient:
      input.liftLb / (input.dynamicPressurePsf * input.wingAreaFt2),
  };
};

export const liftCoefficientTool = createSimpleTool({
  calculate: (input) =>
    calculateLiftCoefficient(input as unknown as LiftCoefficientInput),
  description:
    "Compute the lift coefficient from lift force, dynamic pressure, and wing area.",
  id: "aviation/lift-coefficient",
  inputs: [
    {
      description: "Total lift force.",
      id: "liftLb",
      kind: "number",
      label: "Lift",
      unit: "lb",
    },
    {
      description: "Dynamic pressure at the current airspeed.",
      format: "pressure-psf",
      id: "dynamicPressurePsf",
      kind: "number",
      label: "Dynamic pressure",
      unit: "lb/ft²",
    },
    {
      description: "Reference wing area.",
      id: "wingAreaFt2",
      kind: "number",
      label: "Wing area",
      unit: "ft²",
    },
  ],
  outputs: [
    {
      description: "Dimensionless lift coefficient.",
      format: "coefficient",
      id: "liftCoefficient",
      kind: "number",
      label: "CL",
    },
  ],
  title: "Lift Coefficient Calculator",
});
export const runLiftCoefficient = liftCoefficientTool.execute;
export default liftCoefficientTool;

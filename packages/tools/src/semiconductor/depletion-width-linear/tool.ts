import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DepletionWidthLinearInput = {
  readonly builtInVoltageV: number;
  readonly gradeConstantPerCm3: number;
  readonly reverseBiasV?: number;
};

export type DepletionWidthLinearOutput = {
  readonly widthUm: number;
};

/** Silicon permittivity in farads per centimeter. */
export const SILICON_EPSILON_F_PER_CM = 11.7 * 8.854187817e-14;
/** Elementary charge in coulombs. */
export const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const depletionWidthLinearExample = {
  input: { builtInVoltageV: 0.7, gradeConstantPerCm3: 1e20 },
  output: { widthUm: 0.815895419027 },
} satisfies ToolExample<DepletionWidthLinearInput, DepletionWidthLinearOutput>;

export const calculateDepletionWidthLinear = (
  input: DepletionWidthLinearInput,
): DepletionWidthLinearOutput => {
  if (input.gradeConstantPerCm3 <= 0)
    simpleError(
      "gradeConstantPerCm3",
      "The grading constant must be positive.",
      "invalid_grading",
    );
  const totalVoltage =
    input.builtInVoltageV + (input.reverseBiasV ?? 0);
  if (totalVoltage < 0)
    simpleError(
      "reverseBiasV",
      "Total voltage cannot be negative.",
      "invalid_voltage",
    );
  const widthCm = Math.cbrt(
    (12 *
      SILICON_EPSILON_F_PER_CM *
      totalVoltage) /
      (ELEMENTARY_CHARGE_C * input.gradeConstantPerCm3),
  );
  return { widthUm: roundStatistic(widthCm * 10_000) };
};

export const depletionWidthLinearTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionWidthLinear(
      input as unknown as DepletionWidthLinearInput,
    ),
  description:
    "Compute the depletion width of a linearly graded silicon junction.",
  id: "semiconductor/depletion-width-linear",
  inputs: [
    {
      description: "Built-in potential of the junction.",
      id: "builtInVoltageV",
      kind: "number",
      label: "Built-in voltage",
      unit: "V",
    },
    {
      description:
        "Linear grading constant a in the impurity profile N = a*x.",
      format: "density-per-cm3",
      id: "gradeConstantPerCm3",
      kind: "number",
      label: "Grading constant",
      unit: "cm^-3",
    },
    {
      default: 0,
      description: "Applied reverse bias.",
      id: "reverseBiasV",
      kind: "number",
      label: "Reverse bias",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Total depletion width.",
      format: "length-um",
      id: "widthUm",
      kind: "number",
      label: "Depletion width",
      unit: "µm",
    },
  ],
  title: "Depletion Width Linearly Graded Junction Calculator",
});
export const runDepletionWidthLinear = depletionWidthLinearTool.execute;
export default depletionWidthLinearTool;

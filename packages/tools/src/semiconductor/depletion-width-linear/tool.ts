import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DepletionWidthLinearInput = {
  readonly builtInVoltageV: number;
  readonly gradeConstantPerCm4: number;
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
  input: { builtInVoltageV: 0.7, gradeConstantPerCm4: 1e20, reverseBiasV: 0 },
  output: { widthUm: 0.8158954190267437 },
} satisfies ToolExample<DepletionWidthLinearInput, DepletionWidthLinearOutput>;

export const calculateDepletionWidthLinear = (
  input: DepletionWidthLinearInput,
): DepletionWidthLinearOutput => {
  const builtIn = input.builtInVoltageV;
  const grade = input.gradeConstantPerCm4;
  const reverse = input.reverseBiasV ?? 0;

  if (!Number.isFinite(builtIn) || builtIn < 0)
    simpleError(
      "builtInVoltageV",
      "Built-in voltage must be a finite number at least 0.",
      "invalid_built_in",
    );
  if (!Number.isFinite(grade) || grade <= 0)
    simpleError(
      "gradeConstantPerCm4",
      "Grading constant must be a finite positive number.",
      "invalid_grading",
    );
  if (!Number.isFinite(reverse) || reverse < 0)
    simpleError(
      "reverseBiasV",
      "Reverse bias must be a finite number at least 0.",
      "invalid_reverse_bias",
    );
  const totalVoltage = builtIn + reverse;
  if (!Number.isFinite(totalVoltage))
    simpleError(
      "reverseBiasV",
      "Total voltage overflowed.",
      "numeric_overflow",
    );
  if (totalVoltage < 0)
    simpleError(
      "reverseBiasV",
      "Total voltage cannot be negative.",
      "invalid_voltage",
    );
  const widthCm = Math.cbrt(
    (12 * SILICON_EPSILON_F_PER_CM * totalVoltage) /
      (ELEMENTARY_CHARGE_C * grade),
  );
  if (!Number.isFinite(widthCm) || (totalVoltage > 0 && widthCm === 0))
    simpleError(
      "reverseBiasV",
      "Depletion width overflowed.",
      "numeric_overflow",
    );
  const widthUm = widthCm * 10000;
  if (!Number.isFinite(widthUm) || (totalVoltage > 0 && widthUm === 0))
    simpleError(
      "reverseBiasV",
      "Depletion width overflowed.",
      "numeric_overflow",
    );
  return { widthUm: widthUm === 0 ? 0 : widthUm };
};

export const depletionWidthLinearTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionWidthLinear({
      builtInVoltageV: input.builtInVoltageV as number,
      gradeConstantPerCm4: input.gradeConstantPerCm4 as number,
      reverseBiasV: (input.reverseBiasV as number | undefined) ?? undefined,
    }),
  description:
    "Compute the depletion width of a linearly graded silicon junction. Assumes silicon permittivity 11.7·ε0.",
  id: "semiconductor/depletion-width-linear",
  inputs: [
    {
      description: "Built-in potential of the junction. Must be at least 0 V.",
      id: "builtInVoltageV",
      kind: "number",
      label: "Built-in voltage",
      minimum: 0,
      unit: "V",
    },
    {
      description:
        "Linear grading constant a in the net impurity profile N(x) = a·x. Because x is measured in centimeters, a must be greater than 0 cm^-4.",
      id: "gradeConstantPerCm4",
      kind: "number",
      label: "Grading constant",
      minimum: Number.MIN_VALUE,
      unit: "cm^-4",
    },
    {
      default: 0,
      description: "Applied reverse bias. Must be at least 0 V.",
      id: "reverseBiasV",
      kind: "number",
      label: "Reverse bias",
      minimum: 0,
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
      minimum: 0,
      unit: "µm",
    },
  ],
  title: "Depletion Width Linearly Graded Junction Calculator",
});
export const runDepletionWidthLinear = depletionWidthLinearTool.execute;
export default depletionWidthLinearTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  ELEMENTARY_CHARGE_C,
  SILICON_EPSILON_F_PER_CM,
} from "../depletion-width-linear/tool.js";

export type DepletionCapacitanceLinearInput = {
  readonly areaCm2: number;
  readonly builtInVoltageV?: number;
  readonly gradeConstantPerCm4: number;
  readonly reverseBiasV?: number;
};

export type DepletionCapacitanceLinearOutput = {
  readonly capacitancePf: number;
};

export const depletionCapacitanceLinearExample = {
  input: {
    areaCm2: 1e-4,
    builtInVoltageV: 0.7,
    gradeConstantPerCm4: 1e20,
  },
  output: { capacitancePf: 1.269697010708481 },
} satisfies ToolExample<
  DepletionCapacitanceLinearInput,
  DepletionCapacitanceLinearOutput
>;

export const calculateDepletionCapacitanceLinear = (
  input: DepletionCapacitanceLinearInput,
): DepletionCapacitanceLinearOutput => {
  const builtIn = input.builtInVoltageV ?? 0.7;
  const reverseBias = input.reverseBiasV ?? 0;
  const totalVoltage = builtIn + reverseBias;
  if (!Number.isFinite(builtIn) || builtIn < 0)
    simpleError(
      "builtInVoltageV",
      "Built-in potential must be a finite number at least 0.",
      "invalid_built_in",
    );
  if (!Number.isFinite(reverseBias) || reverseBias < 0)
    simpleError(
      "reverseBiasV",
      "Reverse bias must be a finite number at least 0.",
      "invalid_reverse_bias",
    );
  if (!Number.isFinite(totalVoltage))
    simpleError(
      "reverseBiasV",
      "Total voltage overflowed.",
      "numeric_overflow",
    );
  if (totalVoltage <= 0)
    simpleError(
      "reverseBiasV",
      "Built-in potential plus reverse bias must be greater than 0 V.",
      "invalid_voltage",
    );
  if (!Number.isFinite(input.areaCm2) || input.areaCm2 <= 0)
    simpleError(
      "areaCm2",
      "Area must be a finite positive number.",
      "invalid_area",
    );
  if (
    !Number.isFinite(input.gradeConstantPerCm4) ||
    input.gradeConstantPerCm4 <= 0
  )
    simpleError(
      "gradeConstantPerCm4",
      "Grading constant must be a finite positive number.",
      "invalid_grading",
    );
  const widthCm = Math.cbrt(
    (12 * SILICON_EPSILON_F_PER_CM * totalVoltage) /
      (ELEMENTARY_CHARGE_C * input.gradeConstantPerCm4),
  );
  if (!Number.isFinite(widthCm) || widthCm <= 0)
    simpleError(
      "gradeConstantPerCm4",
      "Depletion width could not be calculated.",
      "numeric_overflow",
    );
  const farads = (SILICON_EPSILON_F_PER_CM * input.areaCm2) / widthCm;
  if (!Number.isFinite(farads) || farads <= 0)
    simpleError(
      "areaCm2",
      "Capacitance is outside the positive finite numeric range.",
      "numeric_range",
    );
  const capacitancePf = farads * 1e12;
  if (!Number.isFinite(capacitancePf) || capacitancePf <= 0)
    simpleError(
      "areaCm2",
      "Capacitance is outside the positive finite numeric range.",
      "numeric_range",
    );
  return { capacitancePf: capacitancePf === 0 ? 0 : capacitancePf };
};

export const depletionCapacitanceLinearTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionCapacitanceLinear({
      areaCm2: input.areaCm2 as number,
      builtInVoltageV:
        (input.builtInVoltageV as number | undefined) ?? undefined,
      gradeConstantPerCm4: input.gradeConstantPerCm4 as number,
      reverseBiasV: (input.reverseBiasV as number | undefined) ?? undefined,
    }),
  description:
    "Compute the depletion capacitance of a linearly graded silicon junction. Assumes silicon permittivity 11.7·ε0.",
  id: "semiconductor/depletion-capacitance-linear",
  inputs: [
    {
      description: "Junction cross-section area. Must be greater than 0 cm².",
      id: "areaCm2",
      kind: "number",
      label: "Area",
      minimum: Number.MIN_VALUE,
      unit: "cm^2",
    },
    {
      default: 0.7,
      description:
        "Built-in potential. May be 0 V only when reverse bias makes the combined junction potential positive.",
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
      description:
        "Applied reverse bias. Must be at least 0 V, and its sum with built-in potential must be positive.",
      id: "reverseBiasV",
      kind: "number",
      label: "Reverse bias",
      minimum: 0,
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Ideal linearly graded junction depletion capacitance.",
      format: "capacitance-pf",
      id: "capacitancePf",
      kind: "number",
      label: "Capacitance",
      minimum: Number.MIN_VALUE,
      unit: "pF",
    },
  ],
  title: "Depletion Capacitance Linearly Graded Junction Calculator",
});
export const runDepletionCapacitanceLinear =
  depletionCapacitanceLinearTool.execute;
export default depletionCapacitanceLinearTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  ELEMENTARY_CHARGE_C,
  SILICON_EPSILON_F_PER_CM,
} from "../depletion-width-linear/tool.js";

export type DepletionCapacitanceLinearInput = {
  readonly areaCm2: number;
  readonly builtInVoltageV?: number;
  readonly gradeConstantPerCm3: number;
  readonly reverseBiasV?: number;
};

export type DepletionCapacitanceLinearOutput = {
  readonly capacitancePf: number;
};

export const depletionCapacitanceLinearExample = {
  input: {
    areaCm2: 1e-4,
    builtInVoltageV: 0.7,
    gradeConstantPerCm3: 1e20,
  },
  output: { capacitancePf: 1.26969701071 },
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
  if (totalVoltage < 0)
    simpleError(
      "reverseBiasV",
      "Total voltage cannot be negative.",
      "invalid_voltage",
    );
  if (input.areaCm2 <= 0 || input.gradeConstantPerCm3 <= 0)
    simpleError(
      "areaCm2",
      "Area and grading constant must be positive.",
      "invalid_input",
    );
  const widthCm = Math.cbrt(
    (12 * SILICON_EPSILON_F_PER_CM * totalVoltage) /
      (ELEMENTARY_CHARGE_C * input.gradeConstantPerCm3),
  );
  const farads =
    (SILICON_EPSILON_F_PER_CM * input.areaCm2) / widthCm;
  return { capacitancePf: roundStatistic(farads * 1e12) };
};

export const depletionCapacitanceLinearTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionCapacitanceLinear(
      input as unknown as DepletionCapacitanceLinearInput,
    ),
  description:
    "Compute the depletion capacitance of a linearly graded silicon junction.",
  id: "semiconductor/depletion-capacitance-linear",
  inputs: [
    {
      description: "Junction cross-section area.",
      id: "areaCm2",
      kind: "number",
      label: "Area",
      unit: "cm^2",
    },
    {
      default: 0.7,
      description: "Built-in potential.",
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
      description: "Junction capacitance.",
      format: "capacitance-pf",
      id: "capacitancePf",
      kind: "number",
      label: "Capacitance",
      unit: "pF",
    },
  ],
  title: "Depletion Capacitance Linearly Graded Junction Calculator",
});
export const runDepletionCapacitanceLinear =
  depletionCapacitanceLinearTool.execute;
export default depletionCapacitanceLinearTool;

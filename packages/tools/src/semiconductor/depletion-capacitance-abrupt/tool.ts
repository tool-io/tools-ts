import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import {
  ELEMENTARY_CHARGE_C,
  SILICON_EPSILON_F_PER_CM,
} from "../depletion-width-linear/tool.js";

export type DepletionCapacitanceAbruptInput = {
  readonly areaCm2: number;
  readonly builtInVoltageV?: number;
  readonly dopingPerCm3: number;
  readonly reverseBiasV?: number;
};

export type DepletionCapacitanceAbruptOutput = {
  readonly capacitancePf: number;
};

export const depletionCapacitanceAbruptExample = {
  input: {
    areaCm2: 1e-4,
    builtInVoltageV: 0.7,
    dopingPerCm3: 1e16,
  },
  output: { capacitancePf: 3.4431700733 },
} satisfies ToolExample<
  DepletionCapacitanceAbruptInput,
  DepletionCapacitanceAbruptOutput
>;

export const calculateDepletionCapacitanceAbrupt = (
  input: DepletionCapacitanceAbruptInput,
): DepletionCapacitanceAbruptOutput => {
  const builtIn = input.builtInVoltageV ?? 0.7;
  const reverseBias = input.reverseBiasV ?? 0;
  const totalVoltage = builtIn + reverseBias;
  if (totalVoltage < 0)
    simpleError(
      "reverseBiasV",
      "Total voltage cannot be negative.",
      "invalid_voltage",
    );
  if (input.areaCm2 <= 0 || input.dopingPerCm3 <= 0)
    simpleError(
      "areaCm2",
      "Area and doping must be positive.",
      "invalid_input",
    );
  const widthCm = Math.sqrt(
    (2 *
      SILICON_EPSILON_F_PER_CM *
      totalVoltage) /
      (ELEMENTARY_CHARGE_C * input.dopingPerCm3),
  );
  const farads =
    (SILICON_EPSILON_F_PER_CM * input.areaCm2) / widthCm;
  return { capacitancePf: roundStatistic(farads * 1e12) };
};

export const depletionCapacitanceAbruptTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionCapacitanceAbrupt(
      input as unknown as DepletionCapacitanceAbruptInput,
    ),
  description:
    "Compute the depletion capacitance of an abrupt silicon junction per its area and light-side doping.",
  id: "semiconductor/depletion-capacitance-abrupt",
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
      description: "Lighter-side doping concentration.",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping",
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
  title: "Depletion Capacitance Abrupt Junction Calculator",
});
export const runDepletionCapacitanceAbrupt =
  depletionCapacitanceAbruptTool.execute;
export default depletionCapacitanceAbruptTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
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
  output: { capacitancePf: 3.4431700732994064 },
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
  if (!Number.isFinite(input.dopingPerCm3) || input.dopingPerCm3 <= 0)
    simpleError(
      "dopingPerCm3",
      "Doping must be a finite positive number.",
      "invalid_doping",
    );
  const widthCm = Math.sqrt(
    (2 * SILICON_EPSILON_F_PER_CM * totalVoltage) /
      (ELEMENTARY_CHARGE_C * input.dopingPerCm3),
  );
  if (!Number.isFinite(widthCm) || widthCm <= 0)
    simpleError(
      "dopingPerCm3",
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

export const depletionCapacitanceAbruptTool = createSimpleTool({
  calculate: (input) =>
    calculateDepletionCapacitanceAbrupt({
      areaCm2: input.areaCm2 as number,
      builtInVoltageV:
        (input.builtInVoltageV as number | undefined) ?? undefined,
      dopingPerCm3: input.dopingPerCm3 as number,
      reverseBiasV: (input.reverseBiasV as number | undefined) ?? undefined,
    }),
  description:
    "Compute one-sided abrupt silicon junction depletion capacitance from area and lightly doped-side concentration. Assumes εSi = 11.7·ε0.",
  id: "semiconductor/depletion-capacitance-abrupt",
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
        "Lighter-side doping concentration. Must be greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "dopingPerCm3",
      kind: "number",
      label: "Doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
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
      description: "Ideal one-sided abrupt-junction depletion capacitance.",
      format: "capacitance-pf",
      id: "capacitancePf",
      kind: "number",
      label: "Capacitance",
      minimum: Number.MIN_VALUE,
      unit: "pF",
    },
  ],
  title: "One-Sided Abrupt Junction Depletion Capacitance Calculator",
});
export const runDepletionCapacitanceAbrupt =
  depletionCapacitanceAbruptTool.execute;
export default depletionCapacitanceAbruptTool;

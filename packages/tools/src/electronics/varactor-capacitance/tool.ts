import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaractorCapacitanceInput = {
  readonly builtInVolts?: number;
  readonly gammaExponent?: number;
  readonly reverseVolts: number;
  readonly zeroBiasCapacitanceF: number;
};

export type VaractorCapacitanceOutput = {
  readonly junctionCapacitanceF: number;
};

export const varactorCapacitanceExample = {
  input: { builtInVolts: 1, reverseVolts: 3, zeroBiasCapacitanceF: 1e-10 },
  output: { junctionCapacitanceF: 5e-11 },
} satisfies ToolExample<VaractorCapacitanceInput, VaractorCapacitanceOutput>;

export const calculateVaractorCapacitance = (
  input: VaractorCapacitanceInput,
): VaractorCapacitanceOutput => {
  if (!(input.zeroBiasCapacitanceF > 0))
    simpleError(
      "zeroBiasCapacitanceF",
      "Zero-bias capacitance must be positive.",
      "invalid_capacitance",
    );
  if (!(input.reverseVolts > 0))
    simpleError(
      "reverseVolts",
      "Reverse voltage must be positive.",
      "invalid_voltage",
    );
  const builtIn = input.builtInVolts ?? 0.7;
  if (!(builtIn > 0))
    simpleError(
      "builtInVolts",
      "Built-in potential must be positive.",
      "invalid_voltage",
    );
  const gamma = input.gammaExponent ?? 0.5;
  if (!(gamma >= 0.3) || !(gamma <= 2))
    simpleError(
      "gammaExponent",
      "Grading coefficient must be between 0.3 and 2.",
      "invalid_gamma",
    );
  return {
    junctionCapacitanceF:
      input.zeroBiasCapacitanceF /
      Math.pow(1 + input.reverseVolts / builtIn, gamma),
  };
};

export const varactorCapacitanceTool = createSimpleTool({
  calculate: (input) =>
    calculateVaractorCapacitance(input as unknown as VaractorCapacitanceInput),
  description:
    "Compute the junction capacitance of a varactor diode from its zero-bias capacitance, reverse voltage, built-in potential, and grading coefficient.",
  id: "electronics/varactor-capacitance",
  inputs: [
    {
      description: "Junction capacitance at zero reverse bias.",
      format: "capacitance",
      id: "zeroBiasCapacitanceF",
      kind: "number",
      label: "Zero-bias capacitance",
      unit: "F",
    },
    {
      description: "Reverse bias applied across the junction.",
      format: "voltage",
      id: "reverseVolts",
      kind: "number",
      label: "Reverse voltage",
      unit: "V",
    },
    {
      default: 0.7,
      description: "Built-in potential of the junction.",
      format: "voltage",
      id: "builtInVolts",
      kind: "number",
      label: "Built-in potential",
      unit: "V",
    },
    {
      default: 0.5,
      description: "Grading coefficient of the junction profile.",
      id: "gammaExponent",
      kind: "number",
      label: "Grading coefficient",
      maximum: 2,
      minimum: 0.3,
    },
  ],
  outputs: [
    {
      description: "Biased junction capacitance.",
      format: "capacitance",
      id: "junctionCapacitanceF",
      kind: "number",
      label: "Junction capacitance",
      unit: "F",
    },
  ],
  title: "Varactor Capacitance",
});
export const runVaractorCapacitance = varactorCapacitanceTool.execute;
export default varactorCapacitanceTool;

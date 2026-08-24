import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type QuantumResistanceInput = {
  readonly channelCount?: number;
};

export type QuantumResistanceOutput = {
  readonly resistanceOhms: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const PLANCK_CONSTANT_J_S = 6.62607015e-34;

export const quantumResistanceExample = {
  input: { channelCount: 1 },
  output: { resistanceOhms: 25812.807459304513 },
} satisfies ToolExample<QuantumResistanceInput, QuantumResistanceOutput>;

export const calculateQuantumResistance = (
  channelCount: number,
): QuantumResistanceOutput => ({
  resistanceOhms:
    PLANCK_CONSTANT_J_S /
    (ELEMENTARY_CHARGE_C * ELEMENTARY_CHARGE_C * channelCount),
});

export const quantumResistanceTool = createSimpleTool({
  calculate: (input) => {
    return calculateQuantumResistance(input.channelCount as number);
  },
  description:
    "Calculate ideal Landauer resistance as h/(Ne²), where N is the number of fully transmitting spin-resolved modes; a spin-degenerate orbital channel contributes two modes.",
  id: "semiconductor/quantum-resistance",
  inputs: [
    {
      default: 1,
      description:
        "Number of fully transmitting spin-resolved modes. Use two for one spin-degenerate orbital channel.",
      id: "channelCount",
      kind: "integer",
      label: "Channel count",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Quantized channel resistance.",
      format: "resistance",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "ohm",
    },
  ],
  title: "Landauer Quantum Resistance Calculator",
});
export const runQuantumResistance = quantumResistanceTool.execute;
export default quantumResistanceTool;

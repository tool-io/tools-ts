import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubthresholdSlopeInput = {
  readonly depletionCapacitanceRatio: number;
  readonly temperatureK?: number;
};

export type SubthresholdSlopeOutput = {
  readonly slopeMVPerDecade: number;
};

const KB_J_PER_K = 1.380649e-23;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const subthresholdSlopeExample = {
  input: { depletionCapacitanceRatio: 0.3, temperatureK: 300 },
  output: { slopeMVPerDecade: 77.38435813203125 },
} satisfies ToolExample<SubthresholdSlopeInput, SubthresholdSlopeOutput>;

export const calculateSubthresholdSlope = (
  input: SubthresholdSlopeInput,
): SubthresholdSlopeOutput => {
  const temperatureK = input.temperatureK ?? 300;
  if (temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  if (input.depletionCapacitanceRatio < 0)
    simpleError(
      "depletionCapacitanceRatio",
      "The capacitance ratio cannot be negative.",
      "invalid_ratio",
    );
  const thermalVoltage = (KB_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  return {
    slopeMVPerDecade:
      Math.log(10) *
      thermalVoltage *
      (1 + input.depletionCapacitanceRatio) *
      1000,
  };
};

export const subthresholdSlopeTool = createSimpleTool({
  calculate: (input) =>
    calculateSubthresholdSlope({
      depletionCapacitanceRatio: input.depletionCapacitanceRatio as number,
      temperatureK: input.temperatureK as number,
    }),
  description:
    "Compute the MOSFET subthreshold swing in millivolts per decade of drain current.",
  id: "semiconductor/mosfet-subthreshold-slope",
  inputs: [
    {
      description:
        "Ratio of the depletion capacitance to the gate oxide capacitance (Cd/Cox).",
      id: "depletionCapacitanceRatio",
      kind: "number",
      label: "Cd/Cox",
      minimum: 0,
    },
    {
      default: 300,
      description: "Device temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Subthreshold swing in millivolts per decade.",
      format: "voltage-mv",
      id: "slopeMVPerDecade",
      kind: "number",
      label: "Subthreshold slope",
      minimum: Number.MIN_VALUE,
      unit: "mV/dec",
    },
  ],
  title: "MOSFET Subthreshold Slope Calculator",
});
export const runSubthresholdSlope = subthresholdSlopeTool.execute;
export default subthresholdSlopeTool;

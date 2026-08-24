import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SubthresholdSwingInput = {
  readonly depletionToOxideCapacitanceRatio: number;
  readonly temperatureKelvin?: number;
};

export type SubthresholdSwingOutput = {
  readonly subthresholdSwingMVPerDecade: number;
};

export const subthresholdSwingExample = {
  input: { depletionToOxideCapacitanceRatio: 0.1 },
  output: { subthresholdSwingMVPerDecade: 65.47907226446175 },
} satisfies ToolExample<SubthresholdSwingInput, SubthresholdSwingOutput>;

export const subthresholdSwingTool = createSimpleTool({
  id: "semiconductor/subthreshold-swing",
  title: "Subthreshold Swing Calculator",
  description:
    "Compute MOSFET subthreshold swing from absolute temperature and the depletion-to-oxide capacitance ratio using S = ln(10) kT/q (1 + Cdep/Cox).",
  inputs: [
    {
      id: "depletionToOxideCapacitanceRatio",
      label: "Depletion-to-oxide capacitance ratio",
      kind: "number",
      minimum: 0,
      description: "Ratio of depletion capacitance to oxide capacitance.",
    },
    {
      default: 300,
      description: "Absolute device temperature.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
  ],
  outputs: [
    {
      id: "subthresholdSwingMVPerDecade",
      label: "Subthreshold swing",
      kind: "number",
      unit: "mV/decade",
      description: "Subthreshold swing in millivolts per decade.",
    },
  ],
  calculate: (input) => {
    const temperatureKelvin = input.temperatureKelvin as number;
    if (!(temperatureKelvin > 0))
      simpleError("temperatureKelvin", "Temperature must be positive.");
    return {
      subthresholdSwingMVPerDecade:
        Math.LN10 *
        8.617333262e-5 *
        temperatureKelvin *
        1000 *
        (1 + (input.depletionToOxideCapacitanceRatio as number)),
    };
  },
});
export const runSubthresholdSwing = subthresholdSwingTool.execute;
export default subthresholdSwingTool;

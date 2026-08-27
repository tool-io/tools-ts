import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecibelPowerRatioInput = {
  readonly measuredPowerW: number;
  readonly referencePowerW: number;
};

export type DecibelPowerRatioOutput = {
  readonly decibelsDb: number;
};

export const decibelPowerRatioExample = {
  input: {
    measuredPowerW: 10,
    referencePowerW: 1,
  },
  output: { decibelsDb: 10 },
} satisfies ToolExample<DecibelPowerRatioInput, DecibelPowerRatioOutput>;

export const calculateDecibelPowerRatio = (
  input: DecibelPowerRatioInput,
): DecibelPowerRatioOutput => {
  if (input.referencePowerW <= 0 || input.measuredPowerW <= 0)
    simpleError(
      "referencePowerW",
      "Both power levels must be positive for a logarithmic ratio.",
      "invalid_input",
    );
  return {
    decibelsDb: 10 * Math.log10(input.measuredPowerW / input.referencePowerW),
  };
};

export const decibelPowerRatioTool = createSimpleTool({
  calculate: (input) =>
    calculateDecibelPowerRatio(input as unknown as DecibelPowerRatioInput),
  description:
    "Compute a power ratio in decibels, dB = 10 * log10(P2 / P1); a tenfold power increase is +10 dB.",
  id: "electronics/decibel-power-ratio",
  inputs: [
    {
      description: "Measured or output power level.",
      id: "measuredPowerW",
      kind: "number",
      label: "Measured power",
      unit: "W",
    },
    {
      description: "Reference or input power level.",
      id: "referencePowerW",
      kind: "number",
      label: "Reference power",
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "Level of the measured power relative to the reference.",
      format: "decibel-db",
      id: "decibelsDb",
      kind: "number",
      label: "Power ratio",
      unit: "dB",
    },
  ],
  title: "Decibel Power Ratio Calculator",
});
export const runDecibelPowerRatio = decibelPowerRatioTool.execute;
export default decibelPowerRatioTool;

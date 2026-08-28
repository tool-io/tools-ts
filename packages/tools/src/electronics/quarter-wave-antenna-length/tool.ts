import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QuarterWaveAntennaLengthInput = {
  readonly frequencyHz: number;
  readonly velocityFactor?: number;
};

export type QuarterWaveAntennaLengthOutput = {
  readonly elementLengthM: number;
};

/** Speed of light in vacuum, m/s. */
const SPEED_OF_LIGHT_M_PER_S = 299792458;

export const quarterWaveAntennaLengthExample = {
  input: {
    frequencyHz: 1e8,
    velocityFactor: 0.95,
  },
  output: { elementLengthM: 0.7120070877499999 },
} satisfies ToolExample<
  QuarterWaveAntennaLengthInput,
  QuarterWaveAntennaLengthOutput
>;

export const calculateQuarterWaveAntennaLength = (
  input: QuarterWaveAntennaLengthInput,
): QuarterWaveAntennaLengthOutput => {
  const velocityFactor = input.velocityFactor ?? 1;
  if (input.frequencyHz <= 0)
    simpleError(
      "frequencyHz",
      "The operating frequency must be positive.",
      "invalid_input",
    );
  if (velocityFactor <= 0 || velocityFactor > 1)
    simpleError(
      "velocityFactor",
      "The velocity factor must lie between zero and one.",
      "invalid_input",
    );
  return {
    elementLengthM:
      (SPEED_OF_LIGHT_M_PER_S / (4 * input.frequencyHz)) * velocityFactor,
  };
};

export const quarterWaveAntennaLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateQuarterWaveAntennaLength(
      input as unknown as QuarterWaveAntennaLengthInput,
    ),
  description:
    "Compute the quarter-wave element length L = c / (4 * f), optionally shortened by an insulation velocity factor; bare wire in free space uses a factor of one.",
  id: "electronics/quarter-wave-antenna-length",
  inputs: [
    {
      description: "Operating frequency of the antenna.",
      format: "frequency-hz",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
    {
      default: 1,
      description:
        "Ratio of propagation speed in the surrounding medium or insulation to the speed of light, between zero and one.",
      format: "factor",
      id: "velocityFactor",
      kind: "number",
      label: "Velocity factor",
      required: false,
    },
  ],
  outputs: [
    {
      description: "Physical length of the quarter-wave element.",
      id: "elementLengthM",
      kind: "number",
      label: "Element length",
      unit: "m",
    },
  ],
  title: "Quarter-Wave Antenna Length Calculator",
});
export const runQuarterWaveAntennaLength = quarterWaveAntennaLengthTool.execute;
export default quarterWaveAntennaLengthTool;

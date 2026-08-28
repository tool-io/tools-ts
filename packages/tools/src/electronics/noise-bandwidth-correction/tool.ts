import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NoiseBandwidthCorrectionInput = {
  readonly rolloffEnum?: "single-pole";
};

export type NoiseBandwidthCorrectionOutput = {
  readonly brickwallFactor: number;
};

export const noiseBandwidthCorrectionExample = {
  input: { rolloffEnum: "single-pole" },
  output: { brickwallFactor: 1.5707963267948966 },
} satisfies ToolExample<
  NoiseBandwidthCorrectionInput,
  NoiseBandwidthCorrectionOutput
>;

export const calculateNoiseBandwidthCorrection = (
  input: NoiseBandwidthCorrectionInput,
): NoiseBandwidthCorrectionOutput => {
  const rolloffEnum = input.rolloffEnum ?? "single-pole";
  if (rolloffEnum !== "single-pole")
    simpleError(
      "rolloffEnum",
      "Only single-pole rolloff is supported.",
      "invalid_rolloff",
    );
  return { brickwallFactor: Math.PI / 2 };
};

export const noiseBandwidthCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateNoiseBandwidthCorrection(
      input as unknown as NoiseBandwidthCorrectionInput,
    ),
  description:
    "Compute the brickwall equivalent-noise-bandwidth correction factor pi / 2 for a single-pole rolloff.",
  id: "electronics/noise-bandwidth-correction",
  inputs: [
    {
      default: "single-pole",
      enum: ["single-pole"],
      id: "rolloffEnum",
      kind: "string",
      label: "Rolloff type",
      required: false,
    },
  ],
  outputs: [
    {
      id: "brickwallFactor",
      kind: "number",
      label: "Brickwall factor",
    },
  ],
  title: "Brickwall Correction Factor",
});
export const runNoiseBandwidthCorrection = noiseBandwidthCorrectionTool.execute;
export default noiseBandwidthCorrectionTool;

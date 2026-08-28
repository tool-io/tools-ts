import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const receiverSensitivityExample = {
  input: {
    bandwidthHz: 1e7,
    noiseFigureDb: 3,
    requiredSnrDb: 10,
  },
} satisfies ToolExample<{
  readonly bandwidthHz: number;
  readonly noiseFigureDb: number;
  readonly requiredSnrDb: number;
}>;

export const receiverSensitivityTool = createSimpleTool({
  id: "electronics/receiver-sensitivity",
  title: "Receiver Sensitivity",
  description:
    "Compute the thermal-noise-limited receiver sensitivity as -174 dBm/Hz plus ten times the base-ten logarithm of the bandwidth plus the noise figure plus the required SNR.",
  inputs: [
    { id: "bandwidthHz", label: "Bandwidth", kind: "number", unit: "Hz" },
    {
      id: "noiseFigureDb",
      label: "Noise figure",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
    {
      id: "requiredSnrDb",
      label: "Required SNR",
      kind: "number",
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "receiverSensitivityDbm",
      label: "Receiver sensitivity",
      kind: "number",
      unit: "dBm",
    },
  ],
  calculate: (input) => {
    const bandwidthHz = input.bandwidthHz as number;
    const noiseFigureDb = input.noiseFigureDb as number;
    const requiredSnrDb = input.requiredSnrDb as number;
    if (!(bandwidthHz > 0))
      simpleError("bandwidthHz", "Bandwidth must be positive.");
    return {
      receiverSensitivityDbm:
        -174 + 10 * Math.log10(bandwidthHz) + noiseFigureDb + requiredSnrDb,
    };
  },
});
export const runReceiverSensitivity = receiverSensitivityTool.execute;
export default receiverSensitivityTool;

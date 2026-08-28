import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const transmitterPowerFromEirpExample = {
  input: { antennaGainDbi: 10, cableLossDb: 2, eirpDbm: 30 },
} satisfies ToolExample<{
  readonly antennaGainDbi: number;
  readonly cableLossDb: number;
  readonly eirpDbm: number;
}>;

export const transmitterPowerFromEirpTool = createSimpleTool({
  id: "electronics/transmitter-power-from-eirp",
  title: "TX Power From EIRP",
  description:
    "Compute the required transmitter output power in dBm from a target EIRP by subtracting the antenna gain and adding the cable loss.",
  inputs: [
    { id: "eirpDbm", label: "Target EIRP", kind: "number", unit: "dBm" },
    {
      id: "antennaGainDbi",
      label: "Antenna gain",
      kind: "number",
      unit: "dBi",
    },
    { id: "cableLossDb", label: "Cable loss", kind: "number", unit: "dB" },
  ],
  outputs: [
    {
      id: "transmitterPowerDbm",
      label: "Transmitter power",
      kind: "number",
      unit: "dBm",
    },
  ],
  calculate: (input) => ({
    transmitterPowerDbm:
      (input.eirpDbm as number) -
      (input.antennaGainDbi as number) +
      (input.cableLossDb as number),
  }),
});
export const runTransmitterPowerFromEirp = transmitterPowerFromEirpTool.execute;
export default transmitterPowerFromEirpTool;

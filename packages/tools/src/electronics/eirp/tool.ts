import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const eirpExample = {
  input: { cableLossDb: 3, txAntennaGainDb: 15, txPowerDbm: 20 },
} satisfies ToolExample<{
  readonly cableLossDb: number;
  readonly txAntennaGainDb: number;
  readonly txPowerDbm: number;
}>;

export const eirpTool = createSimpleTool({
  id: "electronics/eirp",
  title: "EIRP Calculator",
  description:
    "Calculate effective isotropic radiated power from transmitter power, antenna gain, and cable loss.",
  inputs: [
    { id: "txPowerDbm", label: "TX power", kind: "number" },
    { id: "txAntennaGainDb", label: "TX antenna gain", kind: "number" },
    { id: "cableLossDb", label: "Cable loss", kind: "number" },
  ],
  outputs: [{ id: "eirpDbm", label: "EIRP", kind: "number" }],
  calculate: (input) => {
    const txPowerDbm = input.txPowerDbm as number;
    const txAntennaGainDb = input.txAntennaGainDb as number;
    const cableLossDb = input.cableLossDb as number;
    return { eirpDbm: txPowerDbm + txAntennaGainDb - cableLossDb };
  },
});
export const runEirp = eirpTool.execute;
export default eirpTool;

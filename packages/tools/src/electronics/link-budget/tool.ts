import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinkBudgetInput = {
  readonly eirpDbm: number;
  readonly rxGainDb: number;
  readonly pathLossDb: number;
  readonly rxSensitivityDbm: number;
};

export type LinkBudgetOutput = {
  readonly linkMarginDb: number;
};

export const linkBudgetExample = {
  input: { eirpDbm: 20, rxGainDb: 15, pathLossDb: 120, rxSensitivityDbm: -100 },
  output: { linkMarginDb: 15 },
} satisfies ToolExample<LinkBudgetInput, LinkBudgetOutput>;

export const linkBudgetTool = createSimpleTool({
  id: "electronics/link-budget",
  title: "Link Budget Margin",
  description:
    "Compute the link margin in decibels as EIRP + receiver gain - path loss - receiver sensitivity.",
  inputs: [
    { id: "eirpDbm", label: "EIRP", kind: "number", unit: "dBm" },
    { id: "rxGainDb", label: "Receiver gain", kind: "number", unit: "dB" },
    { id: "pathLossDb", label: "Path loss", kind: "number", unit: "dB" },
    {
      id: "rxSensitivityDbm",
      label: "Receiver sensitivity",
      kind: "number",
      unit: "dBm",
    },
  ],
  outputs: [
    { id: "linkMarginDb", label: "Link margin", kind: "number", unit: "dB" },
  ],
  calculate: (input) => {
    const eirpDbm = input.eirpDbm as number;
    const rxGainDb = input.rxGainDb as number;
    const pathLossDb = input.pathLossDb as number;
    const rxSensitivityDbm = input.rxSensitivityDbm as number;
    if (!Number.isFinite(eirpDbm))
      simpleError("eirpDbm", "EIRP must be finite.", "invalid_level");
    if (!Number.isFinite(rxGainDb))
      simpleError("rxGainDb", "Receiver gain must be finite.", "invalid_level");
    if (!Number.isFinite(pathLossDb))
      simpleError("pathLossDb", "Path loss must be finite.", "invalid_level");
    if (!Number.isFinite(rxSensitivityDbm))
      simpleError(
        "rxSensitivityDbm",
        "Receiver sensitivity must be finite.",
        "invalid_level",
      );
    return {
      linkMarginDb: eirpDbm + rxGainDb - pathLossDb - rxSensitivityDbm,
    };
  },
});
export const runLinkBudget = linkBudgetTool.execute;
export default linkBudgetTool;

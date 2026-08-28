import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const linkMarginExample = {
  input: {
    eirpDbm: 20,
    fsplDb: 100,
    rxGainDbi: 2,
    rxSensitivityDbm: -100,
  },
} satisfies ToolExample<{
  readonly eirpDbm: number;
  readonly fsplDb: number;
  readonly rxGainDbi: number;
  readonly rxSensitivityDbm: number;
}>;

export const linkMarginTool = createSimpleTool({
  id: "electronics/link-margin",
  title: "Link Margin dB",
  description:
    "Compute the link margin in dB as EIRP plus receive gain minus free-space path loss minus receiver sensitivity.",
  inputs: [
    { id: "eirpDbm", label: "EIRP", kind: "number", unit: "dBm" },
    { id: "rxGainDbi", label: "Receive gain", kind: "number", unit: "dBi" },
    { id: "fsplDb", label: "Path loss", kind: "number", unit: "dB" },
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
  calculate: (input) => ({
    linkMarginDb:
      (input.eirpDbm as number) +
      (input.rxGainDbi as number) -
      (input.fsplDb as number) -
      (input.rxSensitivityDbm as number),
  }),
});
export const runLinkMargin = linkMarginTool.execute;
export default linkMarginTool;

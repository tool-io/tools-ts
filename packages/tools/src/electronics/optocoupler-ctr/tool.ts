import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OptocouplerCtrInput = {
  readonly collectorCurrentMa: number;
  readonly ledForwardMa: number;
};

export type OptocouplerCtrOutput = {
  readonly currentTransferRatioPercent: number;
};

export const optocouplerCtrExample = {
  input: { collectorCurrentMa: 10, ledForwardMa: 5 },
  output: { currentTransferRatioPercent: 200 },
} satisfies ToolExample<OptocouplerCtrInput, OptocouplerCtrOutput>;

export const calculateOptocouplerCtr = (
  input: OptocouplerCtrInput,
): OptocouplerCtrOutput => {
  if (!(input.ledForwardMa > 0))
    simpleError(
      "ledForwardMa",
      "LED forward current must be positive.",
      "invalid_current",
    );
  if (!(input.collectorCurrentMa >= 0))
    simpleError(
      "collectorCurrentMa",
      "Collector current must not be negative.",
      "invalid_current",
    );
  return {
    currentTransferRatioPercent:
      (input.collectorCurrentMa / input.ledForwardMa) * 100,
  };
};

export const optocouplerCtrTool = createSimpleTool({
  calculate: (input) =>
    calculateOptocouplerCtr(input as unknown as OptocouplerCtrInput),
  description:
    "Compute the current transfer ratio of an optocoupler from LED forward current and collector current.",
  id: "electronics/optocoupler-ctr",
  inputs: [
    {
      description: "Current flowing through the output transistor collector.",
      format: "current",
      id: "collectorCurrentMa",
      kind: "number",
      label: "Collector current",
      unit: "mA",
    },
    {
      description: "Forward current through the input LED.",
      format: "current",
      id: "ledForwardMa",
      kind: "number",
      label: "LED forward current",
      unit: "mA",
    },
  ],
  outputs: [
    {
      description: "Ratio of collector current to LED current as a percentage.",
      format: "percent",
      id: "currentTransferRatioPercent",
      kind: "number",
      label: "Current transfer ratio",
      unit: "%",
    },
  ],
  title: "CTR Percent",
});
export const runOptocouplerCtr = optocouplerCtrTool.execute;
export default optocouplerCtrTool;

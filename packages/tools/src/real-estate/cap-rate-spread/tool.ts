import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapRateSpreadInput = Readonly<{
  readonly capRatePercent: number;
  readonly financingRatePercent: number;
}>;
export type CapRateSpreadOutput = Readonly<{
  readonly spreadPercentagePoints: number;
}>;

export const calculateCapRateSpread = (
  x: CapRateSpreadInput,
): CapRateSpreadOutput => {
  if (!Number.isFinite(x.capRatePercent))
    simpleError("capRatePercent", "Provide a finite number.");
  if (!Number.isFinite(x.financingRatePercent))
    simpleError("financingRatePercent", "Provide a finite number.");
  const spreadPercentagePoints = x.capRatePercent - x.financingRatePercent;
  if (!Number.isFinite(spreadPercentagePoints))
    simpleError(
      "spreadPercentagePoints",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    spreadPercentagePoints: Object.is(spreadPercentagePoints, -0)
      ? 0
      : spreadPercentagePoints,
  };
};

export const example = {
  input: {
    capRatePercent: 6,
    financingRatePercent: 5,
  },
  output: { spreadPercentagePoints: 1 },
} satisfies ToolExample<CapRateSpreadInput, CapRateSpreadOutput>;

export const tool = createSimpleTool({
  id: "real-estate/cap-rate-spread",
  title: "Cap Rate Spread",
  description:
    "Signed spread in percentage points between a property cap rate and a financing rate.",
  inputs: [
    {
      id: "capRatePercent",
      kind: "number",
      label: "Cap Rate Percent",
      unit: "percent",
    },
    {
      id: "financingRatePercent",
      kind: "number",
      label: "Financing Rate Percent",
      unit: "percent",
    },
  ],
  outputs: [
    {
      id: "spreadPercentagePoints",
      kind: "number",
      label: "Spread Percentage Points",
      unit: "percentage-points",
    },
  ],
  calculate: (input) =>
    calculateCapRateSpread({
      capRatePercent: input.capRatePercent as number,
      financingRatePercent: input.financingRatePercent as number,
    }),
});
export const capRateSpreadTool = tool;
export const runCapRateSpread = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MostBusBandwidthInput = Readonly<{
  readonly grossRateMbps: number;
  readonly payloadEfficiency: number;
}>;
export type MostBusBandwidthOutput = Readonly<{
  readonly payloadBandwidthMbps: number;
}>;

export const calculateMostBusBandwidth = (
  x: MostBusBandwidthInput,
): MostBusBandwidthOutput => {
  if (!Number.isFinite(x.grossRateMbps) || x.grossRateMbps < 0)
    simpleError("grossRateMbps", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.payloadEfficiency) || x.payloadEfficiency < 0)
    simpleError("payloadEfficiency", "Provide a finite number at least 0.");
  if (!(x.payloadEfficiency <= 1))
    simpleError("payloadEfficiency", "Efficiency cannot exceed one.");
  const payloadBandwidthMbps = x.grossRateMbps * x.payloadEfficiency;
  if (!Number.isFinite(payloadBandwidthMbps))
    simpleError(
      "payloadBandwidthMbps",
      "The inputs produce an invalid result.",
    );
  return {
    payloadBandwidthMbps: Object.is(payloadBandwidthMbps, -0)
      ? 0
      : payloadBandwidthMbps,
  };
};

export const example = {
  input: { grossRateMbps: 150, payloadEfficiency: 0.8 },
  output: { payloadBandwidthMbps: 120 },
} satisfies ToolExample<MostBusBandwidthInput, MostBusBandwidthOutput>;

export const tool = createSimpleTool({
  id: "electronics/most-bus-bandwidth",
  title: "MOST Bus Bandwidth",
  description:
    "Estimate usable MOST payload bandwidth from gross link bit rate and measured or specified payload-efficiency fraction.",
  inputs: [
    {
      id: "grossRateMbps",
      kind: "number",
      label: "Gross MOST link rate",
      unit: "Mb/s",
      minimum: 0,
    },
    {
      id: "payloadEfficiency",
      kind: "number",
      label: "Payload efficiency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "payloadBandwidthMbps",
      kind: "number",
      label: "Usable payload bandwidth",
      unit: "Mb/s",
    },
  ],
  calculate: (input) =>
    calculateMostBusBandwidth({
      grossRateMbps: input.grossRateMbps as number,
      payloadEfficiency: input.payloadEfficiency as number,
    }),
});
export const mostBusBandwidthTool = tool;
export const runMostBusBandwidth = tool.execute;
export default tool;

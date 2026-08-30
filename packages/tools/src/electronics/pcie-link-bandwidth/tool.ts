import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcieLinkBandwidthInput = Readonly<{
  readonly transferRateGtps: number;
  readonly laneCount: number;
  readonly encodingEfficiency: number;
}>;
export type PcieLinkBandwidthOutput = Readonly<{
  readonly oneDirectionGbPerS: number;
}>;

export const calculatePcieLinkBandwidth = (
  x: PcieLinkBandwidthInput,
): PcieLinkBandwidthOutput => {
  if (!Number.isFinite(x.transferRateGtps) || x.transferRateGtps < 0)
    simpleError("transferRateGtps", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.laneCount) || x.laneCount < 1)
    simpleError("laneCount", "Provide a safe integer at least 1.");
  if (!Number.isFinite(x.encodingEfficiency) || x.encodingEfficiency < 0)
    simpleError("encodingEfficiency", "Provide a finite number at least 0.");
  if (!(
    x.laneCount > 0 &&
    x.encodingEfficiency > 0 &&
    x.encodingEfficiency <= 1
  ))
    simpleError(
      "input",
      "Lane count and encoding efficiency must be positive.",
    );
  const oneDirectionGbPerS =
    (x.transferRateGtps * x.laneCount * x.encodingEfficiency) / 8;
  if (!Number.isFinite(oneDirectionGbPerS))
    simpleError("oneDirectionGbPerS", "The inputs produce an invalid result.");
  return {
    oneDirectionGbPerS: Object.is(oneDirectionGbPerS, -0)
      ? 0
      : oneDirectionGbPerS,
  };
};

export const example = {
  input: {
    transferRateGtps: 16,
    laneCount: 4,
    encodingEfficiency: 0.9846153846153847,
  },
  output: { oneDirectionGbPerS: 7.876923076923077 },
} satisfies ToolExample<PcieLinkBandwidthInput, PcieLinkBandwidthOutput>;

export const tool = createSimpleTool({
  id: "electronics/pcie-link-bandwidth",
  title: "PCIe Link Bandwidth",
  description:
    "Estimate one-direction PCIe payload bandwidth from transfer rate, lane count, and the selected generation's encoding efficiency; excludes packet overhead.",
  inputs: [
    {
      id: "transferRateGtps",
      kind: "number",
      label: "Raw transfer rate per lane",
      unit: "GT/s",
      minimum: 0,
    },
    { id: "laneCount", kind: "integer", label: "Lane count", minimum: 1 },
    {
      id: "encodingEfficiency",
      kind: "number",
      label: "Encoding efficiency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "oneDirectionGbPerS",
      kind: "number",
      label: "One-direction bandwidth",
      unit: "GB/s",
    },
  ],
  calculate: (input) =>
    calculatePcieLinkBandwidth({
      transferRateGtps: input.transferRateGtps as number,
      laneCount: input.laneCount as number,
      encodingEfficiency: input.encodingEfficiency as number,
    }),
});
export const pcieLinkBandwidthTool = tool;
export const runPcieLinkBandwidth = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HdmiTmdsRateInput = Readonly<{
  readonly pixelClockMHz: number;
  readonly bitsPerChannel: number;
}>;
export type HdmiTmdsRateOutput = Readonly<{
  readonly laneRateGbps: number;
}>;

export const calculateHdmiTmdsRate = (
  x: HdmiTmdsRateInput,
): HdmiTmdsRateOutput => {
  if (!Number.isFinite(x.pixelClockMHz) || x.pixelClockMHz < 0)
    simpleError("pixelClockMHz", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.bitsPerChannel) || x.bitsPerChannel < 8)
    simpleError("bitsPerChannel", "Provide a safe integer at least 8.");
  if (![8, 10, 12, 16].includes(x.bitsPerChannel))
    simpleError(
      "bitsPerChannel",
      "Use a supported TMDS channel depth (8, 10, 12, or 16).",
    );
  const laneRateGbps = (x.pixelClockMHz * 10 * x.bitsPerChannel) / 8000;
  if (!Number.isFinite(laneRateGbps))
    simpleError("laneRateGbps", "The inputs produce an invalid result.");
  return { laneRateGbps: Object.is(laneRateGbps, -0) ? 0 : laneRateGbps };
};

export const example = {
  input: { pixelClockMHz: 148.5, bitsPerChannel: 8 },
  output: { laneRateGbps: 1.485 },
} satisfies ToolExample<HdmiTmdsRateInput, HdmiTmdsRateOutput>;

export const tool = createSimpleTool({
  id: "electronics/hdmi-tmds-rate",
  title: "HDMI TMDS Lane Rate",
  description:
    "Estimate legacy HDMI TMDS serial bit rate per data lane from pixel clock and channel bit depth; HDMI 2.1 FRL uses a different link model.",
  inputs: [
    {
      id: "pixelClockMHz",
      kind: "number",
      label: "Pixel clock",
      unit: "MHz",
      minimum: 0,
    },
    {
      id: "bitsPerChannel",
      kind: "integer",
      label: "Channel bit depth",
      unit: "bit",
      minimum: 8,
    },
  ],
  outputs: [
    {
      id: "laneRateGbps",
      kind: "number",
      label: "TMDS rate per lane",
      unit: "Gb/s",
    },
  ],
  calculate: (input) =>
    calculateHdmiTmdsRate({
      pixelClockMHz: input.pixelClockMHz as number,
      bitsPerChannel: input.bitsPerChannel as number,
    }),
});
export const hdmiTmdsRateTool = tool;
export const runHdmiTmdsRate = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LineHeightRatioInput = {
  readonly fontSizePx: number;
  readonly lineHeightPx: number;
};

export type LineHeightRatioOutput = {
  readonly lineHeightRatio: number;
};

export const lineHeightRatioExample = {
  input: { fontSizePx: 16, lineHeightPx: 24 },
  output: { lineHeightRatio: 1.5 },
} satisfies ToolExample<LineHeightRatioInput, LineHeightRatioOutput>;

export const lineHeightRatioTool = createSimpleTool({
  id: "typography/line-height-ratio",
  title: "Line Height Ratio Calculator",
  description: "Compute the unitless line height ratio from pixel values.",
  inputs: [
    {
      description: "Font size in pixels.",
      id: "fontSizePx",
      kind: "number",
      label: "Font size (px)",
    },
    {
      description: "Line height in pixels.",
      id: "lineHeightPx",
      kind: "number",
      label: "Line height (px)",
    },
  ],
  outputs: [
    {
      description: "Unitless line height ratio.",
      id: "lineHeightRatio",
      kind: "number",
      label: "Line height ratio",
    },
  ],
  calculate: (input) => {
    const fontSizePx = input.fontSizePx as number;
    const lineHeightPx = input.lineHeightPx as number;
    if (!(fontSizePx > 0))
      simpleError("fontSizePx", "Font size must be greater than zero.");
    if (!(lineHeightPx > 0))
      simpleError("lineHeightPx", "Line height must be greater than zero.");
    return { lineHeightRatio: lineHeightPx / fontSizePx };
  },
});

export const runLineHeightRatio = lineHeightRatioTool.execute;
export default lineHeightRatioTool;

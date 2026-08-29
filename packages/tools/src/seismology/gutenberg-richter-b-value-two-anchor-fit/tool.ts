import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gutenbergRichterBValueTwoAnchorFitExample = {
  input: {
    magnitudeLow: 2,
    cumulativeLow: 1000,
    magnitudeHigh: 4,
    cumulativeHigh: 10,
  },
  output: { bValue: 1, aValueLog10: 5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gutenbergRichterBValueTwoAnchorFitTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeLow, cumulativeLow, magnitudeHigh, cumulativeHigh }) => {
      if (cumulativeHigh <= 0 || cumulativeLow <= 0)
        simpleError("cumulativeLow", "Counts must be positive.");
      if (magnitudeHigh <= magnitudeLow)
        simpleError("magnitudeHigh", "M₂ must exceed M₁.");
      const bValue =
        (Math.log10(cumulativeLow) - Math.log10(cumulativeHigh)) /
        (magnitudeHigh - magnitudeLow);
      return {
        bValue,
        aValueLog10: Math.log10(cumulativeLow) + bValue * magnitudeLow,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "b-value from two cumulative-count anchors of the Gutenberg-Richter law.",
  id: "seismology/gutenberg-richter-b-value-two-anchor-fit",
  inputs: [
    {
      description: "Lower magnitude anchor.",
      id: "magnitudeLow",
      kind: "number",
      label: "M₁",
    },
    {
      minimum: 0,
      description: "Cumulative count at M₁.",
      id: "cumulativeLow",
      kind: "number",
      label: "N₁",
    },
    {
      description: "Higher magnitude anchor.",
      id: "magnitudeHigh",
      kind: "number",
      label: "M₂",
    },
    {
      minimum: 0,
      description: "Cumulative count at M₂.",
      id: "cumulativeHigh",
      kind: "number",
      label: "N₂",
    },
  ],
  outputs: [
    {
      description: "Gutenberg-Richter b-value.",
      id: "bValue",
      kind: "number",
      label: "b",
    },
    {
      description: "Productivity term a (log10 annual count at M=0).",
      id: "aValueLog10",
      kind: "number",
      label: "a",
    },
  ],
  title: "Gutenberg Richter B Value Two Anchor Fit",
});
export const runGutenbergRichterBValueTwoAnchorFit =
  gutenbergRichterBValueTwoAnchorFitTool.execute;
export { gutenbergRichterBValueTwoAnchorFitExample as example };
export default gutenbergRichterBValueTwoAnchorFitTool;

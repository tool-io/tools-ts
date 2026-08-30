import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RenderScalePercentageInput = Readonly<{
  readonly renderWidthPixels: number;
  readonly panelWidthPixels: number;
}>;
export type RenderScalePercentageOutput = Readonly<{
  readonly scalePercent: number;
}>;

export const calculateRenderScalePercentage = (
  x: RenderScalePercentageInput,
): RenderScalePercentageOutput => {
  if (
    !Number.isFinite(x.renderWidthPixels) ||
    !Number.isSafeInteger(x.renderWidthPixels) ||
    x.renderWidthPixels < 1
  )
    simpleError("renderWidthPixels", "Provide a positive safe integer.");
  if (
    !Number.isFinite(x.panelWidthPixels) ||
    !Number.isSafeInteger(x.panelWidthPixels) ||
    x.panelWidthPixels < 1
  )
    simpleError("panelWidthPixels", "Provide a positive safe integer.");
  const scalePercent = (100 * x.renderWidthPixels) / x.panelWidthPixels;
  if (!Number.isFinite(scalePercent))
    simpleError(
      "scalePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { scalePercent: Object.is(scalePercent, -0) ? 0 : scalePercent };
};

export const example = {
  input: {
    renderWidthPixels: 1800,
    panelWidthPixels: 2000,
  },
  output: { scalePercent: 90 },
} satisfies ToolExample<
  RenderScalePercentageInput,
  RenderScalePercentageOutput
>;

export const tool = createSimpleTool({
  id: "vr/render-scale-percentage",
  title: "Render Scale Percentage",
  description:
    "Per-axis render resolution as a percentage of native panel resolution for one eye.",
  inputs: [
    {
      id: "renderWidthPixels",
      kind: "integer",
      label: "Render Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "panelWidthPixels",
      kind: "integer",
      label: "Panel Width Pixels",
      unit: "px",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "scalePercent",
      kind: "number",
      label: "Scale Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateRenderScalePercentage({
      renderWidthPixels: input.renderWidthPixels as number,
      panelWidthPixels: input.panelWidthPixels as number,
    }),
});
export const renderScalePercentageTool = tool;
export const runRenderScalePercentage = tool.execute;
export default tool;

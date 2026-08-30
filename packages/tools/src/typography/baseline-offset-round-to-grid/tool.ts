import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BaselineOffsetRoundToGridInput = Readonly<{
  readonly offsetPixels: number;
  readonly gridPixels: number;
}>;
export type BaselineOffsetRoundToGridOutput = Readonly<{
  readonly alignedPixels: number;
}>;

export const calculateBaselineOffsetRoundToGrid = (
  x: BaselineOffsetRoundToGridInput,
): BaselineOffsetRoundToGridOutput => {
  if (!Number.isFinite(x.offsetPixels))
    simpleError("offsetPixels", "Provide a finite number.");
  if (!Number.isFinite(x.gridPixels) || x.gridPixels <= 0)
    simpleError("gridPixels", "Provide a finite positive number.");
  const alignedPixels =
    Math.round(x.offsetPixels / x.gridPixels) * x.gridPixels;
  if (!Number.isFinite(alignedPixels))
    simpleError(
      "alignedPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { alignedPixels: Object.is(alignedPixels, -0) ? 0 : alignedPixels };
};

export const example = {
  input: {
    offsetPixels: 23,
    gridPixels: 8,
  },
  output: { alignedPixels: 24 },
} satisfies ToolExample<
  BaselineOffsetRoundToGridInput,
  BaselineOffsetRoundToGridOutput
>;

export const tool = createSimpleTool({
  id: "typography/baseline-offset-round-to-grid",
  title: "Baseline Offset Round To Grid",
  description:
    "Nearest baseline-grid multiple to a requested vertical offset in pixels.",
  inputs: [
    { id: "offsetPixels", kind: "number", label: "Offset Pixels", unit: "px" },
    {
      id: "gridPixels",
      kind: "number",
      label: "Grid Pixels",
      unit: "px",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "alignedPixels",
      kind: "number",
      label: "Aligned Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateBaselineOffsetRoundToGrid({
      offsetPixels: input.offsetPixels as number,
      gridPixels: input.gridPixels as number,
    }),
});
export const baselineOffsetRoundToGridTool = tool;
export const runBaselineOffsetRoundToGrid = tool.execute;
export default tool;

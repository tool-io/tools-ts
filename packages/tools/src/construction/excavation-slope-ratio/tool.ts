import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExcavationSlopeRatioInput = Readonly<{
  readonly horizontalRunMeters: number;
  readonly verticalRiseMeters: number;
}>;
export type ExcavationSlopeRatioOutput = Readonly<{
  readonly horizontalToVerticalRatio: number;
}>;

export const calculateExcavationSlopeRatio = (
  x: ExcavationSlopeRatioInput,
): ExcavationSlopeRatioOutput => {
  if (!Number.isFinite(x.horizontalRunMeters) || x.horizontalRunMeters < 0)
    simpleError("horizontalRunMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.verticalRiseMeters) || x.verticalRiseMeters < 0)
    simpleError("verticalRiseMeters", "Provide a finite number at least 0.");
  const horizontalToVerticalRatio =
    x.horizontalRunMeters / x.verticalRiseMeters;
  if (!Number.isFinite(horizontalToVerticalRatio))
    simpleError(
      "horizontalToVerticalRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    horizontalToVerticalRatio: Object.is(horizontalToVerticalRatio, -0)
      ? 0
      : horizontalToVerticalRatio,
  };
};

export const example = {
  input: { horizontalRunMeters: 3, verticalRiseMeters: 2 },
  output: { horizontalToVerticalRatio: 1.5 },
} satisfies ToolExample<ExcavationSlopeRatioInput, ExcavationSlopeRatioOutput>;

export const tool = createSimpleTool({
  id: "construction/excavation-slope-ratio",
  title: "Excavation Slope Ratio",
  description:
    "Horizontal run per unit vertical rise of an excavation slope; this geometric ratio is not a safe-slope determination.",
  inputs: [
    {
      id: "horizontalRunMeters",
      kind: "number",
      label: "Horizontal Run Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "verticalRiseMeters",
      kind: "number",
      label: "Vertical Rise Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "horizontalToVerticalRatio",
      kind: "number",
      label: "Horizontal To Vertical Ratio",
    },
  ],
  calculate: (input) =>
    calculateExcavationSlopeRatio({
      horizontalRunMeters: input.horizontalRunMeters as number,
      verticalRiseMeters: input.verticalRiseMeters as number,
    }),
});
export const excavationSlopeRatioTool = tool;
export const runExcavationSlopeRatio = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintThinnerRatioInput = Readonly<{
  readonly totalLiters: number;
  readonly thinnerParts: number;
  readonly paintParts: number;
}>;
export type PaintThinnerRatioOutput = Readonly<{
  readonly thinnerLiters: number;
}>;

export const calculatePaintThinnerRatio = (
  x: PaintThinnerRatioInput,
): PaintThinnerRatioOutput => {
  if (!Number.isFinite(x.totalLiters) || x.totalLiters < 0)
    simpleError("totalLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thinnerParts) || x.thinnerParts < 0)
    simpleError("thinnerParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.paintParts) || x.paintParts < 0)
    simpleError("paintParts", "Provide a finite number at least 0.");
  const thinnerLiters =
    (x.totalLiters * x.thinnerParts) / (x.thinnerParts + x.paintParts);
  if (!Number.isFinite(thinnerLiters))
    simpleError(
      "thinnerLiters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { thinnerLiters: Object.is(thinnerLiters, -0) ? 0 : thinnerLiters };
};

export const example = {
  input: { totalLiters: 10, thinnerParts: 1, paintParts: 9 },
  output: { thinnerLiters: 1 },
} satisfies ToolExample<PaintThinnerRatioInput, PaintThinnerRatioOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-thinner-ratio",
  title: "Paint Thinner Ratio",
  description:
    "Thinner volume for a target total coating mix from thinner and paint parts by volume; follow the coating datasheet limits.",
  inputs: [
    {
      id: "totalLiters",
      kind: "number",
      label: "Total Liters",
      unit: "L",
      minimum: 0,
    },
    { id: "thinnerParts", kind: "number", label: "Thinner Parts", minimum: 0 },
    { id: "paintParts", kind: "number", label: "Paint Parts", minimum: 0 },
  ],
  outputs: [
    { id: "thinnerLiters", kind: "number", label: "Thinner Liters", unit: "L" },
  ],
  calculate: (input) =>
    calculatePaintThinnerRatio({
      totalLiters: input.totalLiters as number,
      thinnerParts: input.thinnerParts as number,
      paintParts: input.paintParts as number,
    }),
});
export const paintThinnerRatioTool = tool;
export const runPaintThinnerRatio = tool.execute;
export default tool;

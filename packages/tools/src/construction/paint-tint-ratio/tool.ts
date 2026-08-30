import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintTintRatioInput = Readonly<{
  readonly totalLiters: number;
  readonly tintParts: number;
  readonly baseParts: number;
}>;
export type PaintTintRatioOutput = Readonly<{
  readonly tintLiters: number;
}>;

export const calculatePaintTintRatio = (
  x: PaintTintRatioInput,
): PaintTintRatioOutput => {
  if (!Number.isFinite(x.totalLiters) || x.totalLiters < 0)
    simpleError("totalLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tintParts) || x.tintParts < 0)
    simpleError("tintParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baseParts) || x.baseParts < 0)
    simpleError("baseParts", "Provide a finite number at least 0.");
  const tintLiters =
    (x.totalLiters * x.tintParts) / (x.tintParts + x.baseParts);
  if (!Number.isFinite(tintLiters))
    simpleError(
      "tintLiters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { tintLiters: Object.is(tintLiters, -0) ? 0 : tintLiters };
};

export const example = {
  input: { totalLiters: 10, tintParts: 1, baseParts: 9 },
  output: { tintLiters: 1 },
} satisfies ToolExample<PaintTintRatioInput, PaintTintRatioOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-tint-ratio",
  title: "Paint Tint Ratio",
  description:
    "Tint volume for a target total paint mix from tint parts and base-paint parts by volume.",
  inputs: [
    {
      id: "totalLiters",
      kind: "number",
      label: "Total Liters",
      unit: "L",
      minimum: 0,
    },
    { id: "tintParts", kind: "number", label: "Tint Parts", minimum: 0 },
    { id: "baseParts", kind: "number", label: "Base Parts", minimum: 0 },
  ],
  outputs: [
    { id: "tintLiters", kind: "number", label: "Tint Liters", unit: "L" },
  ],
  calculate: (input) =>
    calculatePaintTintRatio({
      totalLiters: input.totalLiters as number,
      tintParts: input.tintParts as number,
      baseParts: input.baseParts as number,
    }),
});
export const paintTintRatioTool = tool;
export const runPaintTintRatio = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintHardenerRatioInput = Readonly<{
  readonly totalLiters: number;
  readonly hardenerParts: number;
  readonly resinParts: number;
}>;
export type PaintHardenerRatioOutput = Readonly<{
  readonly hardenerLiters: number;
}>;

export const calculatePaintHardenerRatio = (
  x: PaintHardenerRatioInput,
): PaintHardenerRatioOutput => {
  if (!Number.isFinite(x.totalLiters) || x.totalLiters < 0)
    simpleError("totalLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hardenerParts) || x.hardenerParts < 0)
    simpleError("hardenerParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resinParts) || x.resinParts < 0)
    simpleError("resinParts", "Provide a finite number at least 0.");
  const hardenerLiters =
    (x.totalLiters * x.hardenerParts) / (x.hardenerParts + x.resinParts);
  if (!Number.isFinite(hardenerLiters))
    simpleError(
      "hardenerLiters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { hardenerLiters: Object.is(hardenerLiters, -0) ? 0 : hardenerLiters };
};

export const example = {
  input: { totalLiters: 10, hardenerParts: 1, resinParts: 4 },
  output: { hardenerLiters: 2 },
} satisfies ToolExample<PaintHardenerRatioInput, PaintHardenerRatioOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-hardener-ratio",
  title: "Paint Hardener Ratio",
  description:
    "Hardener volume for a target two-part coating mix from the specified hardener-to-resin volume-parts ratio.",
  inputs: [
    {
      id: "totalLiters",
      kind: "number",
      label: "Total Liters",
      unit: "L",
      minimum: 0,
    },
    {
      id: "hardenerParts",
      kind: "number",
      label: "Hardener Parts",
      minimum: 0,
    },
    { id: "resinParts", kind: "number", label: "Resin Parts", minimum: 0 },
  ],
  outputs: [
    {
      id: "hardenerLiters",
      kind: "number",
      label: "Hardener Liters",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculatePaintHardenerRatio({
      totalLiters: input.totalLiters as number,
      hardenerParts: input.hardenerParts as number,
      resinParts: input.resinParts as number,
    }),
});
export const paintHardenerRatioTool = tool;
export const runPaintHardenerRatio = tool.execute;
export default tool;

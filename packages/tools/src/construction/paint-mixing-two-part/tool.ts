import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintMixingTwoPartInput = Readonly<{
  readonly mixedVolumeLiters: number;
  readonly baseParts: number;
  readonly hardenerParts: number;
}>;
export type PaintMixingTwoPartOutput = Readonly<{
  readonly baseLiters: number;
  readonly hardenerLiters: number;
}>;

export const calculatePaintMixingTwoPart = (
  x: PaintMixingTwoPartInput,
): PaintMixingTwoPartOutput => {
  if (!Number.isFinite(x.mixedVolumeLiters) || x.mixedVolumeLiters < 0)
    simpleError("mixedVolumeLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baseParts) || x.baseParts < 0)
    simpleError("baseParts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hardenerParts) || x.hardenerParts < 0)
    simpleError("hardenerParts", "Provide a finite number at least 0.");
  if (!(x.baseParts > 0 && x.hardenerParts > 0))
    simpleError("baseParts", "Both mix-ratio parts must be positive.");
  const baseLiters =
    (x.mixedVolumeLiters * x.baseParts) / (x.baseParts + x.hardenerParts);
  if (!Number.isFinite(baseLiters))
    simpleError("baseLiters", "The inputs produce an invalid result.");
  const hardenerLiters =
    (x.mixedVolumeLiters * x.hardenerParts) / (x.baseParts + x.hardenerParts);
  if (!Number.isFinite(hardenerLiters))
    simpleError("hardenerLiters", "The inputs produce an invalid result.");
  return {
    baseLiters: Object.is(baseLiters, -0) ? 0 : baseLiters,
    hardenerLiters: Object.is(hardenerLiters, -0) ? 0 : hardenerLiters,
  };
};

export const example = {
  input: { mixedVolumeLiters: 3, baseParts: 2, hardenerParts: 1 },
  output: { baseLiters: 2, hardenerLiters: 1 },
} satisfies ToolExample<PaintMixingTwoPartInput, PaintMixingTwoPartOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-mixing-two-part",
  title: "Two Part Paint Mixing",
  description:
    "Divide a target mixed paint volume into base and hardener volumes using a manufacturer's by-volume mix ratio.",
  inputs: [
    {
      id: "mixedVolumeLiters",
      kind: "number",
      label: "Target mixed volume",
      unit: "L",
      minimum: 0,
    },
    { id: "baseParts", kind: "number", label: "Base parts", minimum: 0 },
    {
      id: "hardenerParts",
      kind: "number",
      label: "Hardener parts",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "baseLiters", kind: "number", label: "Base volume", unit: "L" },
    {
      id: "hardenerLiters",
      kind: "number",
      label: "Hardener volume",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculatePaintMixingTwoPart({
      mixedVolumeLiters: input.mixedVolumeLiters as number,
      baseParts: input.baseParts as number,
      hardenerParts: input.hardenerParts as number,
    }),
});
export const paintMixingTwoPartTool = tool;
export const runPaintMixingTwoPart = tool.execute;
export default tool;

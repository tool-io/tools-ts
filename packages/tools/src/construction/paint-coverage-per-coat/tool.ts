import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintCoveragePerCoatInput = Readonly<{
  readonly paintLiters: number;
  readonly coverageM2PerLiter: number;
}>;
export type PaintCoveragePerCoatOutput = Readonly<{
  readonly coveredAreaM2: number;
}>;

export const calculatePaintCoveragePerCoat = (
  x: PaintCoveragePerCoatInput,
): PaintCoveragePerCoatOutput => {
  if (!Number.isFinite(x.paintLiters) || x.paintLiters < 0)
    simpleError("paintLiters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.coverageM2PerLiter) || x.coverageM2PerLiter < 0)
    simpleError("coverageM2PerLiter", "Provide a finite number at least 0.");
  const coveredAreaM2 = x.paintLiters * x.coverageM2PerLiter;
  if (!Number.isFinite(coveredAreaM2))
    simpleError("coveredAreaM2", "The inputs produce an invalid result.");
  return { coveredAreaM2: Object.is(coveredAreaM2, -0) ? 0 : coveredAreaM2 };
};

export const example = {
  input: { paintLiters: 5, coverageM2PerLiter: 10 },
  output: { coveredAreaM2: 50 },
} satisfies ToolExample<PaintCoveragePerCoatInput, PaintCoveragePerCoatOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-coverage-per-coat",
  title: "Paint Coverage Per Coat",
  description:
    "Calculate one-coat paint coverage from usable paint volume and the manufacturer's coverage rate.",
  inputs: [
    {
      id: "paintLiters",
      kind: "number",
      label: "Usable paint",
      unit: "L",
      minimum: 0,
    },
    {
      id: "coverageM2PerLiter",
      kind: "number",
      label: "Coverage rate",
      unit: "m²/L",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coveredAreaM2",
      kind: "number",
      label: "One-coat coverage",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculatePaintCoveragePerCoat({
      paintLiters: input.paintLiters as number,
      coverageM2PerLiter: input.coverageM2PerLiter as number,
    }),
});
export const paintCoveragePerCoatTool = tool;
export const runPaintCoveragePerCoat = tool.execute;
export default tool;

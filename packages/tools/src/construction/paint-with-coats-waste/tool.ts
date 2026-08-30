import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintWithCoatsWasteInput = Readonly<{
  readonly areaM2: number;
  readonly coatCount: number;
  readonly coverageM2PerLiter: number;
  readonly wastePercent: number;
}>;
export type PaintWithCoatsWasteOutput = Readonly<{
  readonly paintLiters: number;
}>;

export const calculatePaintWithCoatsWaste = (
  x: PaintWithCoatsWasteInput,
): PaintWithCoatsWasteOutput => {
  if (!Number.isFinite(x.areaM2) || x.areaM2 < 0)
    simpleError("areaM2", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.coatCount) || x.coatCount < 1)
    simpleError("coatCount", "Provide a safe integer at least 1.");
  if (!Number.isFinite(x.coverageM2PerLiter) || x.coverageM2PerLiter < 0)
    simpleError("coverageM2PerLiter", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!(x.coverageM2PerLiter > 0))
    simpleError("coverageM2PerLiter", "Coverage must be positive.");
  const paintLiters =
    ((x.areaM2 * x.coatCount) / x.coverageM2PerLiter) *
    (1 + x.wastePercent / 100);
  if (!Number.isFinite(paintLiters))
    simpleError("paintLiters", "The inputs produce an invalid result.");
  return { paintLiters: Object.is(paintLiters, -0) ? 0 : paintLiters };
};

export const example = {
  input: { areaM2: 50, coatCount: 2, coverageM2PerLiter: 10, wastePercent: 10 },
  output: { paintLiters: 11 },
} satisfies ToolExample<PaintWithCoatsWasteInput, PaintWithCoatsWasteOutput>;

export const tool = createSimpleTool({
  id: "construction/paint-with-coats-waste",
  title: "Paint With Coats and Waste",
  description:
    "Estimate paint liters for a target area and coat count, then add a percentage allowance for application losses.",
  inputs: [
    {
      id: "areaM2",
      kind: "number",
      label: "Paintable area",
      unit: "m²",
      minimum: 0,
    },
    { id: "coatCount", kind: "integer", label: "Coats", minimum: 1 },
    {
      id: "coverageM2PerLiter",
      kind: "number",
      label: "Coverage rate",
      unit: "m²/L",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Loss allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "paintLiters", kind: "number", label: "Paint required", unit: "L" },
  ],
  calculate: (input) =>
    calculatePaintWithCoatsWaste({
      areaM2: input.areaM2 as number,
      coatCount: input.coatCount as number,
      coverageM2PerLiter: input.coverageM2PerLiter as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const paintWithCoatsWasteTool = tool;
export const runPaintWithCoatsWaste = tool.execute;
export default tool;

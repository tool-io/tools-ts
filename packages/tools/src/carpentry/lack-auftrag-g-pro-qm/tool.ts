import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaintCoverageInput = {
  readonly areaM2: number;
  readonly coatCount?: number;
  readonly gramsPerM2PerCoat?: number;
};

export type PaintCoverageOutput = {
  readonly paintGrams: number;
};

export const paintCoverageExample = {
  input: { areaM2: 10, coatCount: 2, gramsPerM2PerCoat: 120 },
  output: { paintGrams: 2400 },
} satisfies ToolExample<PaintCoverageInput, PaintCoverageOutput>;

export const paintCoverageTool = createSimpleTool({
  id: "carpentry/lack-auftrag-g-pro-qm",
  title: "Paint Coverage Calculator",
  description:
    "Calculate the paint quantity in grams for a surface area, number of coats, and coverage per coat.",
  inputs: [
    { id: "areaM2", kind: "number", label: "Surface area", unit: "m²" },
    {
      default: 2,
      description: "Number of paint coats to apply.",
      id: "coatCount",
      kind: "integer",
      label: "Coat count",
      minimum: 1,
    },
    {
      default: 120,
      description: "Paint mass per square meter and coat.",
      id: "gramsPerM2PerCoat",
      kind: "number",
      label: "Coverage",
      unit: "g/m²",
    },
  ],
  outputs: [
    { id: "paintGrams", kind: "number", label: "Paint quantity", unit: "g" },
  ],
  calculate: (input) => {
    const areaM2 = input.areaM2 as number;
    const coatCount = input.coatCount as number;
    const gramsPerM2PerCoat = input.gramsPerM2PerCoat as number;
    if (!(areaM2 > 0))
      simpleError(
        "areaM2",
        "Surface area must be greater than zero.",
        "invalid_area",
      );
    if (!(gramsPerM2PerCoat > 0))
      simpleError(
        "gramsPerM2PerCoat",
        "Coverage must be greater than zero.",
        "invalid_coverage",
      );
    return { paintGrams: areaM2 * coatCount * gramsPerM2PerCoat };
  },
});
export const runPaintCoverage = paintCoverageTool.execute;
export default paintCoverageTool;

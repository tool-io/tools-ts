import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tomographyRayDensityCellCoverageExample = {
  input: { segmentLengthsKm: [30, 40, 50], cellSizeKm: 2 },
  output: { totalCoverageKm: 120, hitDensity: 60, wellResolved: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tomographyRayDensityCellCoverageTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ segmentLengthsKm, cellSizeKm }) => {
      const segs = segmentLengthsKm as unknown[];
      if (
        !Array.isArray(segs) ||
        (segs as number[]).some((length) => length < 0)
      )
        simpleError("segmentLengthsKm", "Provide nonnegative segment lengths.");
      if (!(cellSizeKm > 0))
        simpleError("cellSizeKm", "Cell size must be positive.");
      const totalCoverageKm = (segs as number[]).reduce((a, b) => a + b, 0);
      const hitDensity = totalCoverageKm / cellSizeKm;
      return { totalCoverageKm, hitDensity, wellResolved: hitDensity >= 10 };
    })(input as never) as Record<string, unknown>,
  description:
    "Cell hit density: total ray-path length inside the cell divided by cell size.",
  id: "seismology/tomography-ray-density-cell-coverage",
  inputs: [
    {
      description: "Ray segment lengths crossing the cell.",
      id: "segmentLengthsKm",
      kind: "numberList",
      label: "ℓ_j",
    },
    {
      minimum: 0,
      description: "Cell edge length.",
      id: "cellSizeKm",
      kind: "number",
      label: "a",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Total ray length in the cell.",
      id: "totalCoverageKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      description: "Dimensionless ray density.",
      id: "hitDensity",
      kind: "number",
      label: "L/a",
    },
    {
      description: "Whether density exceeds the resolution threshold.",
      id: "wellResolved",
      kind: "boolean",
      label: "Resolved?",
    },
  ],
  title: "Tomography Ray Density Cell Coverage Calculator",
});
export const runTomographyRayDensityCellCoverage =
  tomographyRayDensityCellCoverageTool.execute;
export { tomographyRayDensityCellCoverageExample as example };
export default tomographyRayDensityCellCoverageTool;

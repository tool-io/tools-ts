import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type TidalDiamondCorrectionInput = {
  readonly currentSetDeg: number;
  readonly currentDriftKt: number;
  readonly courseDeg: number;
};

export type TidalDiamondCorrectionOutput = {
  readonly alongCourseComponentKt: number;
  readonly crossCourseComponentKt: number;
};

export const tidalDiamondCorrectionExample = {
  input: { courseDeg: 90, currentDriftKt: 2, currentSetDeg: 45 },
  output: {
    alongCourseComponentKt: 1.4142135623730951,
    crossCourseComponentKt: -1.414213562373095,
  },
} satisfies ToolExample<
  TidalDiamondCorrectionInput,
  TidalDiamondCorrectionOutput
>;

export const calculateTidalDiamondCorrection = (
  input: TidalDiamondCorrectionInput,
): TidalDiamondCorrectionOutput => {
  const relativeRad = (input.currentSetDeg - input.courseDeg) * (Math.PI / 180);
  return {
    alongCourseComponentKt: input.currentDriftKt * Math.cos(relativeRad),
    crossCourseComponentKt: input.currentDriftKt * Math.sin(relativeRad),
  };
};

export const tidalDiamondCorrectionTool = createSimpleTool({
  id: "sailing/tidal-diamond-correction",
  title: "Tidal Diamond Vector Calculator",
  description:
    "Resolve a tidal diamond set and drift into components along and across the boat's course.",
  inputs: [
    {
      description: "Direction toward which the current flows.",
      id: "currentSetDeg",
      kind: "number",
      label: "Set",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
    {
      description: "Speed of the current.",
      id: "currentDriftKt",
      kind: "number",
      label: "Drift",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Intended course through the water.",
      id: "courseDeg",
      kind: "number",
      label: "Course",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Current component along the course.",
      format: "speed-kt",
      id: "alongCourseComponentKt",
      kind: "number",
      label: "Along-course component",
      unit: "kt",
    },
    {
      description: "Current component across the course.",
      format: "speed-kt",
      id: "crossCourseComponentKt",
      kind: "number",
      label: "Cross-course component",
      unit: "kt",
    },
  ],
  calculate: (input) =>
    calculateTidalDiamondCorrection(
      input as unknown as TidalDiamondCorrectionInput,
    ),
});

export const runTidalDiamondCorrection = tidalDiamondCorrectionTool.execute;
export default tidalDiamondCorrectionTool;

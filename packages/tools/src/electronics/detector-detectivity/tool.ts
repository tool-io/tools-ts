import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DetectorDetectivityInput = Readonly<{
  readonly areaSquareCentimeters: number;
  readonly nepWattsPerRootHz: number;
}>;
export type DetectorDetectivityOutput = Readonly<{
  readonly specificDetectivityCmRootHzPerW: number;
}>;

export const calculateDetectorDetectivity = (
  x: DetectorDetectivityInput,
): DetectorDetectivityOutput => {
  if (!Number.isFinite(x.areaSquareCentimeters) || x.areaSquareCentimeters < 0)
    simpleError("areaSquareCentimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.nepWattsPerRootHz) || x.nepWattsPerRootHz < 0)
    simpleError("nepWattsPerRootHz", "Provide a finite number at least 0.");
  const specificDetectivityCmRootHzPerW =
    Math.sqrt(x.areaSquareCentimeters) / x.nepWattsPerRootHz;
  if (!Number.isFinite(specificDetectivityCmRootHzPerW))
    simpleError(
      "specificDetectivityCmRootHzPerW",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    specificDetectivityCmRootHzPerW: Object.is(
      specificDetectivityCmRootHzPerW,
      -0,
    )
      ? 0
      : specificDetectivityCmRootHzPerW,
  };
};

export const example = {
  input: { areaSquareCentimeters: 0.01, nepWattsPerRootHz: 1e-12 },
  output: { specificDetectivityCmRootHzPerW: 100000000000 },
} satisfies ToolExample<DetectorDetectivityInput, DetectorDetectivityOutput>;

export const tool = createSimpleTool({
  id: "electronics/detector-detectivity",
  title: "Detector Detectivity",
  description:
    "Specific detectivity D* from detector active area and NEP expressed per square-root hertz.",
  inputs: [
    {
      id: "areaSquareCentimeters",
      kind: "number",
      label: "Area Square Centimeters",
      unit: "cm²",
      minimum: 0,
    },
    {
      id: "nepWattsPerRootHz",
      kind: "number",
      label: "Nep Watts Per Root Hz",
      unit: "W/√Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "specificDetectivityCmRootHzPerW",
      kind: "number",
      label: "Specific Detectivity Cm Root Hz Per W",
      unit: "cm√Hz/W",
    },
  ],
  calculate: (input) =>
    calculateDetectorDetectivity({
      areaSquareCentimeters: input.areaSquareCentimeters as number,
      nepWattsPerRootHz: input.nepWattsPerRootHz as number,
    }),
});
export const detectorDetectivityTool = tool;
export const runDetectorDetectivity = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RecutOverlayOffsetDetectorInput = {
  readonly offsetXmm: number;
  readonly offsetYmm: number;
};

export type RecutOverlayOffsetDetectorOutput = {
  readonly offsetMm: number;
  readonly directionDeg: number;
};

export const calculateRecutOverlayOffsetDetector = (
  input: RecutOverlayOffsetDetectorInput,
): RecutOverlayOffsetDetectorOutput => {
  for (const key of ["offsetXmm", "offsetYmm"] as const) {
    if (!Number.isFinite(input[key]))
      return simpleError(
        key,
        "Offset components must be finite numbers.",
        "invalid_offset",
      );
  }
  const offsetMm = Math.hypot(input.offsetXmm, input.offsetYmm);
  const directionDeg =
    (Math.atan2(input.offsetYmm, input.offsetXmm) * 180) / Math.PI;
  return { offsetMm, directionDeg: (directionDeg + 360) % 360 };
};

export const recutOverlayOffsetDetectorExample = {
  input: { offsetXmm: 3, offsetYmm: -4 },
  output: { offsetMm: 5, directionDeg: 306.86989764584405 },
} satisfies ToolExample<
  RecutOverlayOffsetDetectorInput,
  RecutOverlayOffsetDetectorOutput
>;

export const recutOverlayOffsetDetectorTool = createSimpleTool({
  id: "epigraphy/recut-overlay-offset-detector",
  title: "Recut Over Original Overlay Offset Detector",
  description:
    "Quantify the displacement of a recut letter over its original cut from signed x and y offsets, reporting magnitude and direction in degrees.",
  inputs: [
    {
      description:
        "Signed horizontal offset of the recut relative to the original, in millimetres.",
      id: "offsetXmm",
      kind: "number",
      label: "Offset X",
    },
    {
      description:
        "Signed vertical offset of the recut relative to the original, in millimetres.",
      id: "offsetYmm",
      kind: "number",
      label: "Offset Y",
    },
  ],
  outputs: [
    {
      description: "Displacement magnitude in millimetres.",
      id: "offsetMm",
      kind: "number",
      label: "Offset",
    },
    {
      description:
        "Direction of displacement counter-clockwise from east, normalized to 0-360 degrees.",
      id: "directionDeg",
      kind: "number",
      label: "Direction",
    },
  ],
  calculate: (input) =>
    calculateRecutOverlayOffsetDetector(
      input as unknown as RecutOverlayOffsetDetectorInput,
    ),
});

export const runRecutOverlayOffsetDetector =
  recutOverlayOffsetDetectorTool.execute;
export default recutOverlayOffsetDetectorTool;

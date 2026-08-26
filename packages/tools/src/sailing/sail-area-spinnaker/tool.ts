import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpinnakerAreaInput = {
  readonly slLengthMeters: number;
  readonly smwWidthMeters: number;
};

export type SpinnakerAreaOutput = {
  readonly spinnakerAreaM2: number;
};

export const calculateSpinnakerArea = (
  slLengthMeters: number,
  smwWidthMeters: number,
): number | null =>
  slLengthMeters > 0 && smwWidthMeters > 0
    ? 0.75 * slLengthMeters * smwWidthMeters
    : null;

export const spinnakerAreaExample = {
  input: { slLengthMeters: 9, smwWidthMeters: 4 },
  output: { spinnakerAreaM2: 27 },
} satisfies ToolExample<SpinnakerAreaInput, SpinnakerAreaOutput>;

export const spinnakerAreaTool = createSimpleTool({
  id: "sailing/sail-area-spinnaker",
  title: "Spinnaker Area Calculator",
  description:
    "Estimate the symmetric spinnaker area from the SL leech length and SMW width using the standard three-quarter approximation.",
  inputs: [
    { id: "slLengthMeters", kind: "number", label: "SL length", unit: "m" },
    { id: "smwWidthMeters", kind: "number", label: "SMW width", unit: "m" },
  ],
  outputs: [
    {
      format: "area-m2",
      id: "spinnakerAreaM2",
      kind: "number",
      label: "Spinnaker area",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const sl = input.slLengthMeters as number;
    const smw = input.smwWidthMeters as number;
    const spinnakerAreaM2 = calculateSpinnakerArea(sl, smw);
    if (spinnakerAreaM2 === null)
      simpleError(
        sl <= 0 ? "slLengthMeters" : "smwWidthMeters",
        "Enter positive SL and SMW measurements.",
        "invalid_dimensions",
      );
    return { spinnakerAreaM2 };
  },
});

export const runSpinnakerArea = spinnakerAreaTool.execute;
export default spinnakerAreaTool;

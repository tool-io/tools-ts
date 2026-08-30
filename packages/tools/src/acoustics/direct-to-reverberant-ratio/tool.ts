import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DirectToReverberantRatioInput = Readonly<{
  readonly directivityFactor: number;
  readonly roomConstantSquareMeters: number;
  readonly distanceMeters: number;
}>;
export type DirectToReverberantRatioOutput = Readonly<{
  readonly ratioDecibels: number;
}>;

export const calculateDirectToReverberantRatio = (
  x: DirectToReverberantRatioInput,
): DirectToReverberantRatioOutput => {
  if (!Number.isFinite(x.directivityFactor) || x.directivityFactor <= 0)
    simpleError("directivityFactor", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.roomConstantSquareMeters) ||
    x.roomConstantSquareMeters <= 0
  )
    simpleError(
      "roomConstantSquareMeters",
      "Provide a finite positive number.",
    );
  if (!Number.isFinite(x.distanceMeters) || x.distanceMeters <= 0)
    simpleError("distanceMeters", "Provide a finite positive number.");
  const ratioDecibels =
    10 *
    Math.log10(
      (x.directivityFactor * x.roomConstantSquareMeters) /
        (16 * Math.PI * x.distanceMeters ** 2),
    );
  if (!Number.isFinite(ratioDecibels))
    simpleError(
      "ratioDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { ratioDecibels: Object.is(ratioDecibels, -0) ? 0 : ratioDecibels };
};

export const example = {
  input: {
    directivityFactor: 1,
    roomConstantSquareMeters: 100,
    distanceMeters: 1,
  },
  output: { ratioDecibels: 2.9873014464994134 },
} satisfies ToolExample<
  DirectToReverberantRatioInput,
  DirectToReverberantRatioOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/direct-to-reverberant-ratio",
  title: "Direct To Reverberant Ratio",
  description:
    "Ideal direct-to-reverberant sound-energy ratio in dB at distance r, using Q R/(16πr²).",
  inputs: [
    {
      id: "directivityFactor",
      kind: "number",
      label: "Directivity Factor",
      minimum: 0,
    },
    {
      id: "roomConstantSquareMeters",
      kind: "number",
      label: "Room Constant Square Meters",
      unit: "m2",
      minimum: 0,
    },
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "ratioDecibels",
      kind: "number",
      label: "Ratio Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateDirectToReverberantRatio({
      directivityFactor: input.directivityFactor as number,
      roomConstantSquareMeters: input.roomConstantSquareMeters as number,
      distanceMeters: input.distanceMeters as number,
    }),
});
export const directToReverberantRatioTool = tool;
export const runDirectToReverberantRatio = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DistanceDoublingDecibelDropInput = Readonly<{
  readonly distanceDoublings: number;
}>;
export type DistanceDoublingDecibelDropOutput = Readonly<{
  readonly dropDecibels: number;
}>;

export const calculateDistanceDoublingDecibelDrop = (
  x: DistanceDoublingDecibelDropInput,
): DistanceDoublingDecibelDropOutput => {
  if (!Number.isFinite(x.distanceDoublings) || x.distanceDoublings < 0)
    simpleError("distanceDoublings", "Provide a finite nonnegative number.");
  const dropDecibels = 20 * Math.log10(2) * x.distanceDoublings;
  if (!Number.isFinite(dropDecibels))
    simpleError(
      "dropDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { dropDecibels: Object.is(dropDecibels, -0) ? 0 : dropDecibels };
};

export const example = {
  input: {
    distanceDoublings: 1,
  },
  output: { dropDecibels: 6.020599913279624 },
} satisfies ToolExample<
  DistanceDoublingDecibelDropInput,
  DistanceDoublingDecibelDropOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/distance-doubling-decibel-drop",
  title: "Distance Doubling Decibel Drop",
  description:
    "Free-field point-source level reduction in dB after a given number of distance doublings.",
  inputs: [
    {
      id: "distanceDoublings",
      kind: "number",
      label: "Distance Doublings",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "dropDecibels", kind: "number", label: "Drop Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateDistanceDoublingDecibelDrop({
      distanceDoublings: input.distanceDoublings as number,
    }),
});
export const distanceDoublingDecibelDropTool = tool;
export const runDistanceDoublingDecibelDrop = tool.execute;
export default tool;

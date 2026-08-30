import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, rad } from "../shared.js";

export type Input = Readonly<{
  readonly entryMetersPerSecond: number;
  readonly downwardAngleDegrees: number;
  readonly scaleHeightMeters: number;
  readonly referenceGravityMetersPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly peakMetersPerSecondSquared: number;
  readonly peakGravityLoads: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.entryMetersPerSecond, "entryMetersPerSecond");
  positive(input.scaleHeightMeters, "scaleHeightMeters");
  positive(
    input.referenceGravityMetersPerSecondSquared,
    "referenceGravityMetersPerSecondSquared",
  );
  if (input.downwardAngleDegrees <= 0 || input.downwardAngleDegrees > 90)
    simpleError(
      "downwardAngleDegrees",
      "A downward flight-path magnitude in (0,90] is required.",
    );
  const peakMetersPerSecondSquared =
    (input.entryMetersPerSecond ** 2 *
      Math.sin(rad(input.downwardAngleDegrees))) /
    (2 * Math.E * input.scaleHeightMeters);
  return {
    peakMetersPerSecondSquared,
    peakGravityLoads:
      peakMetersPerSecondSquared / input.referenceGravityMetersPerSecondSquared,
  };
};
export const exampleInput = {
  entryMetersPerSecond: 1,
  downwardAngleDegrees: 30,
  scaleHeightMeters: 1,
  referenceGravityMetersPerSecondSquared: 1,
} satisfies Input;
export const exampleOutput = {
  peakMetersPerSecondSquared: 0.09196986029286058,
  peakGravityLoads: 0.09196986029286058,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/exponential-entry-peak-deceleration",
  title: "Exponential Entry Peak Deceleration",
  description:
    "Evaluate the constant-flight-path, drag-only Allen–Eggers exponential-atmosphere peak-deceleration approximation; lift and changing entry angle are neglected.",
  inputs: [
    {
      id: "entryMetersPerSecond",
      label: "Entry meters per second",
      kind: "number",
    },
    {
      id: "downwardAngleDegrees",
      label: "Downward angle degrees",
      kind: "number",
    },
    { id: "scaleHeightMeters", label: "Scale height meters", kind: "number" },
    {
      id: "referenceGravityMetersPerSecondSquared",
      label: "Reference gravity meters per second squared",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "peakMetersPerSecondSquared",
      label: "Peak meters per second squared",
      kind: "number",
    },
    { id: "peakGravityLoads", label: "Peak gravity loads", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      entryMetersPerSecond: value.entryMetersPerSecond as number,
      downwardAngleDegrees: value.downwardAngleDegrees as number,
      scaleHeightMeters: value.scaleHeightMeters as number,
      referenceGravityMetersPerSecondSquared:
        value.referenceGravityMetersPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;

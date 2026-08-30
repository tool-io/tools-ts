import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, rad } from "../shared.js";

export type Input = Readonly<{
  readonly radialKmPerSecond: number;
  readonly convergentAngleDegrees: number;
  readonly alignedProperMotionArcsecPerYear: number;
}>;
export type Output = Readonly<{
  readonly clusterDistanceParsecs: number;
}>;
export const calculate = (input: Input): Output => {
  positive(
    input.alignedProperMotionArcsecPerYear,
    "alignedProperMotionArcsecPerYear",
  );
  if (
    input.convergentAngleDegrees <= 0 ||
    input.convergentAngleDegrees >= 180 ||
    Math.abs(input.convergentAngleDegrees - 90) < 1e-8
  )
    simpleError(
      "convergentAngleDegrees",
      "Convergent angle must be inside (0,180), away from the radial-velocity singularity at 90 degrees.",
    );
  const clusterDistanceParsecs =
    (input.radialKmPerSecond * Math.tan(rad(input.convergentAngleDegrees))) /
    (4.74047 * input.alignedProperMotionArcsecPerYear);
  positive(clusterDistanceParsecs, "radialKmPerSecond");
  return { clusterDistanceParsecs };
};
export const exampleInput = {
  radialKmPerSecond: 1,
  convergentAngleDegrees: 45,
  alignedProperMotionArcsecPerYear: 1,
} satisfies Input;
export const exampleOutput = {
  clusterDistanceParsecs: 0.21094954719679693,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/moving-cluster-distance",
  title: "Moving Cluster Distance",
  description:
    "Solve a moving-cluster distance from radial velocity and proper motion toward the convergent point; coherent bulk motion and negligible expansion are assumed.",
  inputs: [
    { id: "radialKmPerSecond", label: "Radial km per second", kind: "number" },
    {
      id: "convergentAngleDegrees",
      label: "Convergent angle degrees",
      kind: "number",
    },
    {
      id: "alignedProperMotionArcsecPerYear",
      label: "Aligned proper motion arcsec per year",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "clusterDistanceParsecs",
      label: "Cluster distance parsecs",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      radialKmPerSecond: value.radialKmPerSecond as number,
      convergentAngleDegrees: value.convergentAngleDegrees as number,
      alignedProperMotionArcsecPerYear:
        value.alignedProperMotionArcsecPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;

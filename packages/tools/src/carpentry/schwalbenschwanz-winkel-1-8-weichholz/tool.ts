import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DovetailAngleSoftwoodInput = {
  readonly slopeRatioDenominator: number;
};

export type DovetailAngleSoftwoodOutput = {
  readonly angleDegrees: number;
};

export const dovetailAngleSoftwoodExample = {
  input: { slopeRatioDenominator: 8 },
  output: { angleDegrees: 7.125016348901798 },
} satisfies ToolExample<
  DovetailAngleSoftwoodInput,
  DovetailAngleSoftwoodOutput
>;

export const dovetailAngleSoftwoodTool = createSimpleTool({
  id: "carpentry/schwalbenschwanz-winkel-1-8-weichholz",
  title: "Dovetail Angle Softwood",
  description:
    "Compute the dovetail angle in degrees for a 1:n slope ratio suited to softwood.",
  inputs: [
    {
      default: 8,
      description:
        "Denominator n of the dovetail slope ratio 1:n, with 1:8 typical for softwood.",
      id: "slopeRatioDenominator",
      kind: "integer",
      label: "Slope ratio denominator",
      minimum: 2,
    },
  ],
  outputs: [
    {
      description: "Dovetail slope angle from the baseline in degrees.",
      id: "angleDegrees",
      kind: "number",
      label: "Angle",
      unit: "°",
    },
  ],
  calculate: (input) => ({
    angleDegrees:
      (Math.atan(1 / (input.slopeRatioDenominator as number)) * 180) / Math.PI,
  }),
});
export const runDovetailAngleSoftwood = dovetailAngleSoftwoodTool.execute;
export default dovetailAngleSoftwoodTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DovetailAngleHardwoodInput = {
  readonly slopeRatioDenominator: number;
};

export type DovetailAngleHardwoodOutput = {
  readonly angleDegrees: number;
};

export const dovetailAngleHardwoodExample = {
  input: { slopeRatioDenominator: 6 },
  output: { angleDegrees: 9.462322208025617 },
} satisfies ToolExample<
  DovetailAngleHardwoodInput,
  DovetailAngleHardwoodOutput
>;

export const dovetailAngleHardwoodTool = createSimpleTool({
  id: "carpentry/schwalbenschwanz-winkel-1-6-hartholz",
  title: "Dovetail Angle Hardwood",
  description:
    "Compute the dovetail angle in degrees for a 1:n slope ratio suited to hardwood.",
  inputs: [
    {
      default: 6,
      description:
        "Denominator n of the dovetail slope ratio 1:n, with 1:6 typical for hardwood.",
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
export const runDovetailAngleHardwood = dovetailAngleHardwoodTool.execute;
export default dovetailAngleHardwoodTool;

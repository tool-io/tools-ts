import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly leftPropulsionForce: number;
  readonly rightPropulsionForce: number;
  readonly leftLandingForce: number;
  readonly rightLandingForce: number;
}>;
export type Output = Readonly<{
  readonly propulsionAsymmetryPercent: number;
  readonly landingAsymmetryPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const asymmetry = (left: number, right: number, field: string) => {
    const mean = (left + right) / 2;
    if (mean === 0)
      simpleError(field, "At least one side must be positive.", "zero_mean");
    return (Math.abs(left - right) / mean) * 100;
  };
  return {
    propulsionAsymmetryPercent: asymmetry(
      input.leftPropulsionForce,
      input.rightPropulsionForce,
      "leftPropulsionForce",
    ),
    landingAsymmetryPercent: asymmetry(
      input.leftLandingForce,
      input.rightLandingForce,
      "leftLandingForce",
    ),
  };
};

export const exampleInput = {
  leftPropulsionForce: 1000,
  rightPropulsionForce: 900,
  leftLandingForce: 1200,
  rightLandingForce: 1200,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  leftPropulsionForce: 1000,
  rightPropulsionForce: 1000,
  leftLandingForce: 1100,
  rightLandingForce: 900,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      leftPropulsionForce: input.leftPropulsionForce as number,
      rightPropulsionForce: input.rightPropulsionForce as number,
      leftLandingForce: input.leftLandingForce as number,
      rightLandingForce: input.rightLandingForce as number,
    }),
  description:
    "Calculate bilateral force asymmetry separately for propulsion and landing.",
  id: "kinesiology/jump-phase-asymmetry",
  inputs: [
    {
      id: "leftPropulsionForce",
      label: "Left propulsion force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
    {
      id: "rightPropulsionForce",
      label: "Right propulsion force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
    {
      id: "leftLandingForce",
      label: "Left landing force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
    {
      id: "rightLandingForce",
      label: "Right landing force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
  ],
  outputs: [
    {
      id: "propulsionAsymmetryPercent",
      label: "Propulsion asymmetry",
      kind: "number",
      minimum: 0,
      maximum: 200,
      unit: "%",
    },
    {
      id: "landingAsymmetryPercent",
      label: "Landing asymmetry",
      kind: "number",
      minimum: 0,
      maximum: 200,
      unit: "%",
    },
  ],
  title: "Jump Phase Asymmetry",
});

export const run = tool.execute;
export default tool;

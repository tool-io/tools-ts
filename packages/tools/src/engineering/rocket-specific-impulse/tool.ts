import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RocketSpecificImpulseInput = Readonly<{
  readonly thrustNewtons: number;
  readonly massFlowKilogramsPerSecond: number;
  readonly standardGravityMetersPerSecondSquared: number;
}>;
export type RocketSpecificImpulseOutput = Readonly<{
  readonly specificImpulseSeconds: number;
}>;

export const calculateRocketSpecificImpulse = (
  x: RocketSpecificImpulseInput,
): RocketSpecificImpulseOutput => {
  if (!Number.isFinite(x.thrustNewtons) || x.thrustNewtons < 0)
    simpleError("thrustNewtons", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.massFlowKilogramsPerSecond) ||
    x.massFlowKilogramsPerSecond < 0
  )
    simpleError(
      "massFlowKilogramsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.standardGravityMetersPerSecondSquared) ||
    x.standardGravityMetersPerSecondSquared < 0
  )
    simpleError(
      "standardGravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  const specificImpulseSeconds =
    x.thrustNewtons /
    (x.massFlowKilogramsPerSecond * x.standardGravityMetersPerSecondSquared);
  if (!Number.isFinite(specificImpulseSeconds))
    simpleError(
      "specificImpulseSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    specificImpulseSeconds: Object.is(specificImpulseSeconds, -0)
      ? 0
      : specificImpulseSeconds,
  };
};

export const example = {
  input: {
    thrustNewtons: 30000,
    massFlowKilogramsPerSecond: 10,
    standardGravityMetersPerSecondSquared: 9.80665,
  },
  output: { specificImpulseSeconds: 305.9148638933785 },
} satisfies ToolExample<
  RocketSpecificImpulseInput,
  RocketSpecificImpulseOutput
>;

export const tool = createSimpleTool({
  id: "engineering/rocket-specific-impulse",
  title: "Rocket Specific Impulse",
  description:
    "Rocket specific impulse in seconds from thrust divided by propellant mass flow and reference standard gravity.",
  inputs: [
    {
      id: "thrustNewtons",
      kind: "number",
      label: "Thrust Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "massFlowKilogramsPerSecond",
      kind: "number",
      label: "Mass Flow Kilograms Per Second",
      unit: "kg/s",
      minimum: 0,
    },
    {
      id: "standardGravityMetersPerSecondSquared",
      kind: "number",
      label: "Standard Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "specificImpulseSeconds",
      kind: "number",
      label: "Specific Impulse Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateRocketSpecificImpulse({
      thrustNewtons: input.thrustNewtons as number,
      massFlowKilogramsPerSecond: input.massFlowKilogramsPerSecond as number,
      standardGravityMetersPerSecondSquared:
        input.standardGravityMetersPerSecondSquared as number,
    }),
});
export const rocketSpecificImpulseTool = tool;
export const runRocketSpecificImpulse = tool.execute;
export default tool;

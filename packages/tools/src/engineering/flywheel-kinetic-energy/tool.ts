import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlywheelKineticEnergyInput = Readonly<{
  readonly inertiaKgSquareMeters: number;
  readonly angularSpeedRadiansPerSecond: number;
}>;
export type FlywheelKineticEnergyOutput = Readonly<{
  readonly energyJoules: number;
}>;

export const calculateFlywheelKineticEnergy = (
  x: FlywheelKineticEnergyInput,
): FlywheelKineticEnergyOutput => {
  if (!Number.isFinite(x.inertiaKgSquareMeters) || x.inertiaKgSquareMeters < 0)
    simpleError("inertiaKgSquareMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.angularSpeedRadiansPerSecond) ||
    x.angularSpeedRadiansPerSecond < 0
  )
    simpleError(
      "angularSpeedRadiansPerSecond",
      "Provide a finite number at least 0.",
    );
  const energyJoules =
    0.5 * x.inertiaKgSquareMeters * x.angularSpeedRadiansPerSecond ** 2;
  if (!Number.isFinite(energyJoules))
    simpleError(
      "energyJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { energyJoules: Object.is(energyJoules, -0) ? 0 : energyJoules };
};

export const example = {
  input: { inertiaKgSquareMeters: 2, angularSpeedRadiansPerSecond: 10 },
  output: { energyJoules: 100 },
} satisfies ToolExample<
  FlywheelKineticEnergyInput,
  FlywheelKineticEnergyOutput
>;

export const tool = createSimpleTool({
  id: "engineering/flywheel-kinetic-energy",
  title: "Flywheel Kinetic Energy",
  description:
    "Rotational flywheel kinetic energy ½Iω² from mass moment of inertia and angular speed.",
  inputs: [
    {
      id: "inertiaKgSquareMeters",
      kind: "number",
      label: "Inertia Kg Square Meters",
      unit: "kg·m²",
      minimum: 0,
    },
    {
      id: "angularSpeedRadiansPerSecond",
      kind: "number",
      label: "Angular Speed Radians Per Second",
      unit: "rad/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "energyJoules", kind: "number", label: "Energy Joules", unit: "J" },
  ],
  calculate: (input) =>
    calculateFlywheelKineticEnergy({
      inertiaKgSquareMeters: input.inertiaKgSquareMeters as number,
      angularSpeedRadiansPerSecond:
        input.angularSpeedRadiansPerSecond as number,
    }),
});
export const flywheelKineticEnergyTool = tool;
export const runFlywheelKineticEnergy = tool.execute;
export default tool;

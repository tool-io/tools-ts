import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrbitalVelocityInput = Readonly<{
  readonly gravitationalParameterCubicMetersPerSecondSquared: number;
  readonly orbitalRadiusMeters: number;
}>;
export type OrbitalVelocityOutput = Readonly<{
  readonly speedMetersPerSecond: number;
}>;

export const calculateOrbitalVelocity = (
  x: OrbitalVelocityInput,
): OrbitalVelocityOutput => {
  if (
    !Number.isFinite(x.gravitationalParameterCubicMetersPerSecondSquared) ||
    x.gravitationalParameterCubicMetersPerSecondSquared < 0
  )
    simpleError(
      "gravitationalParameterCubicMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.orbitalRadiusMeters) || x.orbitalRadiusMeters < 0)
    simpleError("orbitalRadiusMeters", "Provide a finite number at least 0.");
  const speedMetersPerSecond = Math.sqrt(
    x.gravitationalParameterCubicMetersPerSecondSquared / x.orbitalRadiusMeters,
  );
  if (!Number.isFinite(speedMetersPerSecond))
    simpleError(
      "speedMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    speedMetersPerSecond: Object.is(speedMetersPerSecond, -0)
      ? 0
      : speedMetersPerSecond,
  };
};

export const example = {
  input: {
    gravitationalParameterCubicMetersPerSecondSquared: 398600441800000,
    orbitalRadiusMeters: 7000000,
  },
  output: { speedMetersPerSecond: 7546.053290107542 },
} satisfies ToolExample<OrbitalVelocityInput, OrbitalVelocityOutput>;

export const tool = createSimpleTool({
  id: "engineering/orbital-velocity",
  title: "Orbital Velocity",
  description:
    "Circular-orbit speed √(μ/r) around a central body from its gravitational parameter and distance from its center.",
  inputs: [
    {
      id: "gravitationalParameterCubicMetersPerSecondSquared",
      kind: "number",
      label: "Gravitational Parameter Cubic Meters Per Second Squared",
      unit: "m³/s²",
      minimum: 0,
    },
    {
      id: "orbitalRadiusMeters",
      kind: "number",
      label: "Orbital Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateOrbitalVelocity({
      gravitationalParameterCubicMetersPerSecondSquared:
        input.gravitationalParameterCubicMetersPerSecondSquared as number,
      orbitalRadiusMeters: input.orbitalRadiusMeters as number,
    }),
});
export const orbitalVelocityTool = tool;
export const runOrbitalVelocity = tool.execute;
export default tool;

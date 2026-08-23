import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProjectileMotionInput = {
  readonly initialSpeed: number;
  readonly launchAngleDegrees: number;
  readonly gravity?: number;
};

export type ProjectileMotionOutput = {
  readonly flightTimeSeconds: number;
  readonly maxHeightMeters: number;
  readonly rangeMeters: number;
};

export const calculateProjectileMotion = (
  input: ProjectileMotionInput,
): ProjectileMotionOutput => {
  if (!(input.initialSpeed > 0))
    return simpleError(
      "initialSpeed",
      "Initial speed must be positive.",
      "invalid_speed",
    );
  if (!(input.launchAngleDegrees > 0 && input.launchAngleDegrees < 90))
    return simpleError(
      "launchAngleDegrees",
      "Launch angle must be strictly between 0 and 90 degrees.",
      "invalid_angle",
    );
  const gravity = input.gravity ?? 9.80665;
  if (!(gravity > 0))
    return simpleError(
      "gravity",
      "Gravity must be positive.",
      "invalid_gravity",
    );
  const radians = (input.launchAngleDegrees * Math.PI) / 180;
  const vertical = input.initialSpeed * Math.sin(radians);
  return {
    flightTimeSeconds: (2 * vertical) / gravity,
    maxHeightMeters: (vertical * vertical) / (2 * gravity),
    rangeMeters:
      (input.initialSpeed * input.initialSpeed * Math.sin(2 * radians)) /
      gravity,
  };
};

export const projectileMotionExample = {
  input: {
    initialSpeed: 20,
    launchAngleDegrees: 30,
    gravity: 9.80665,
  },
  output: {
    flightTimeSeconds: 2.039432425955856,
    maxHeightMeters: 5.09858106488964,
    rangeMeters: 35.32400580358996,
  },
} satisfies ToolExample<ProjectileMotionInput, ProjectileMotionOutput>;

export const projectileMotionTool = createSimpleTool({
  id: "physics/projectile-motion",
  title: "Projectile Motion Calculator",
  description:
    "Compute vacuum projectile flight time, maximum height and range from launch speed, launch angle and gravitational acceleration.",
  inputs: [
    {
      description: "Launch speed v0 in meters per second.",
      id: "initialSpeed",
      kind: "number",
      label: "Initial speed",
      unit: "m/s",
    },
    {
      description:
        "Launch angle above the horizontal in degrees (0 exclusive to 90 exclusive).",
      id: "launchAngleDegrees",
      kind: "number",
      label: "Launch angle",
      unit: "deg",
    },
    {
      description: "Gravitational acceleration in meters per second squared.",
      default: 9.80665,
      id: "gravity",
      kind: "number",
      label: "Gravity",
      unit: "m/s2",
    },
  ],
  outputs: [
    {
      description: "Total time of flight 2*v0*sin(theta)/g.",
      id: "flightTimeSeconds",
      kind: "number",
      label: "Flight time",
      unit: "s",
    },
    {
      description: "Peak height (v0*sin(theta))^2/(2g).",
      id: "maxHeightMeters",
      kind: "number",
      label: "Maximum height",
      unit: "m",
    },
    {
      description: "Horizontal range v0^2*sin(2*theta)/g.",
      id: "rangeMeters",
      kind: "number",
      label: "Range",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateProjectileMotion({
      gravity: input.gravity as number,
      initialSpeed: input.initialSpeed as number,
      launchAngleDegrees: input.launchAngleDegrees as number,
    }),
});

export const runProjectileMotion = projectileMotionTool.execute;
export default projectileMotionTool;

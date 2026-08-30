import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParticleVelocityFromPressureInput = Readonly<{
  readonly pressurePascals: number;
  readonly impedanceRayls: number;
}>;
export type ParticleVelocityFromPressureOutput = Readonly<{
  readonly velocityMetersPerSecond: number;
}>;

export const calculateParticleVelocityFromPressure = (
  x: ParticleVelocityFromPressureInput,
): ParticleVelocityFromPressureOutput => {
  if (!Number.isFinite(x.pressurePascals))
    simpleError("pressurePascals", "Provide a finite number.");
  if (!Number.isFinite(x.impedanceRayls) || x.impedanceRayls <= 0)
    simpleError("impedanceRayls", "Provide a finite positive number.");
  const velocityMetersPerSecond = x.pressurePascals / x.impedanceRayls;
  if (!Number.isFinite(velocityMetersPerSecond))
    simpleError(
      "velocityMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    velocityMetersPerSecond: Object.is(velocityMetersPerSecond, -0)
      ? 0
      : velocityMetersPerSecond,
  };
};

export const example = {
  input: {
    pressurePascals: 1,
    impedanceRayls: 400,
  },
  output: { velocityMetersPerSecond: 0.0025 },
} satisfies ToolExample<
  ParticleVelocityFromPressureInput,
  ParticleVelocityFromPressureOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/particle-velocity-from-pressure",
  title: "Particle Velocity From Pressure",
  description:
    "Particle velocity amplitude for a traveling plane wave from pressure amplitude and characteristic impedance.",
  inputs: [
    {
      id: "pressurePascals",
      kind: "number",
      label: "Pressure Pascals",
      unit: "Pa",
    },
    {
      id: "impedanceRayls",
      kind: "number",
      label: "Impedance Rayls",
      unit: "rayl",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "velocityMetersPerSecond",
      kind: "number",
      label: "Velocity Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateParticleVelocityFromPressure({
      pressurePascals: input.pressurePascals as number,
      impedanceRayls: input.impedanceRayls as number,
    }),
});
export const particleVelocityFromPressureTool = tool;
export const runParticleVelocityFromPressure = tool.execute;
export default tool;

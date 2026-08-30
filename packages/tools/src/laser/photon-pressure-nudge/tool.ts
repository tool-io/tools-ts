import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly opticalPowerWatts: number;
  readonly reflectivity: number;
  readonly illuminationSeconds: number;
  readonly targetMassKilograms: number;
}>;
export type Output = Readonly<{
  readonly radiationPressureForceNewtons: number;
  readonly impulseNewtonSeconds: number;
  readonly velocityChangeMetersPerSecond: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.targetMassKilograms <= 0)
    simpleError(
      "targetMassKilograms",
      "Target mass must be positive.",
      "invalid_mass",
    );
  const radiationPressureForceNewtons =
    ((1 + input.reflectivity) * input.opticalPowerWatts) / 299792458;
  const impulseNewtonSeconds =
    radiationPressureForceNewtons * input.illuminationSeconds;
  return {
    radiationPressureForceNewtons,
    impulseNewtonSeconds,
    velocityChangeMetersPerSecond:
      impulseNewtonSeconds / input.targetMassKilograms,
  };
};

export const exampleInput = {
  opticalPowerWatts: 1000,
  reflectivity: 1,
  illuminationSeconds: 10,
  targetMassKilograms: 100,
} satisfies Input;
export const exampleOutput = {
  radiationPressureForceNewtons: 6.671281903963041e-6,
  impulseNewtonSeconds: 6.671281903963041e-5,
  velocityChangeMetersPerSecond: 6.671281903963041e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      opticalPowerWatts: input.opticalPowerWatts as number,
      reflectivity: input.reflectivity as number,
      illuminationSeconds: input.illuminationSeconds as number,
      targetMassKilograms: input.targetMassKilograms as number,
    }),
  description:
    "Estimate ideal photon-pressure force, impulse, and target velocity change.",
  id: "laser/photon-pressure-nudge",
  inputs: [
    {
      id: "opticalPowerWatts",
      label: "Incident optical power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "reflectivity",
      label: "Target reflectivity",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "illuminationSeconds",
      label: "Illumination duration",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
    {
      id: "targetMassKilograms",
      label: "Target mass",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "radiationPressureForceNewtons",
      label: "Radiation-pressure force",
      kind: "number",
      minimum: 0,
      unit: "N",
    },
    {
      id: "impulseNewtonSeconds",
      label: "Delivered impulse",
      kind: "number",
      minimum: 0,
      unit: "N·s",
    },
    {
      id: "velocityChangeMetersPerSecond",
      label: "Velocity change",
      kind: "number",
      minimum: 0,
      unit: "m/s",
    },
  ],
  title: "Photon-Pressure Nudge",
});

export const run = tool.execute;
export default tool;

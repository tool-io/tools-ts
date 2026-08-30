import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly radialVelocitySemiAmplitude: number;
  readonly lightSpeed: number;
  readonly beamingCoefficient: number;
}>;
export type Output = Readonly<{
  readonly fractionalFluxSemiAmplitude: number;
  readonly partsPerMillion: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.radialVelocitySemiAmplitude, "radialVelocitySemiAmplitude");
  positive(input.lightSpeed, "lightSpeed");
  nonnegative(input.beamingCoefficient, "beamingCoefficient");
  if (input.radialVelocitySemiAmplitude / input.lightSpeed >= 0.01)
    simpleError(
      "radialVelocitySemiAmplitude",
      "The linear beaming model requires velocity below one percent of light speed.",
    );
  const fractionalFluxSemiAmplitude =
    (input.beamingCoefficient * input.radialVelocitySemiAmplitude) /
    input.lightSpeed;
  return {
    fractionalFluxSemiAmplitude,
    partsPerMillion: fractionalFluxSemiAmplitude * 1e6,
  };
};
export const exampleInput = {
  radialVelocitySemiAmplitude: 30,
  lightSpeed: 300000,
  beamingCoefficient: 4,
} satisfies Input;
export const exampleOutput = {
  fractionalFluxSemiAmplitude: 0.0004,
  partsPerMillion: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/linear-doppler-beaming-amplitude",
  title: "Linear Doppler Beaming Amplitude",
  description:
    "Compute a small-velocity Doppler-beaming flux semi-amplitude using a supplied band-dependent coefficient and consistent velocity units.",
  inputs: [
    {
      id: "radialVelocitySemiAmplitude",
      label: "Radial velocity semi amplitude",
      kind: "number",
    },
    { id: "lightSpeed", label: "Light speed", kind: "number" },
    { id: "beamingCoefficient", label: "Beaming coefficient", kind: "number" },
  ],
  outputs: [
    {
      id: "fractionalFluxSemiAmplitude",
      label: "Fractional flux semi amplitude",
      kind: "number",
    },
    { id: "partsPerMillion", label: "Parts per million", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      radialVelocitySemiAmplitude: value.radialVelocitySemiAmplitude as number,
      lightSpeed: value.lightSpeed as number,
      beamingCoefficient: value.beamingCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;

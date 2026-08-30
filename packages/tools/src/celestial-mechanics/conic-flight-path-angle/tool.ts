import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, rad, deg } from "../shared.js";

export type Input = Readonly<{
  readonly orbitalEccentricity: number;
  readonly trueAnomalyDegrees: number;
}>;
export type Output = Readonly<{
  readonly flightPathAngleDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.orbitalEccentricity, "orbitalEccentricity");
  const nu = rad(input.trueAnomalyDegrees),
    radialFactor = 1 + input.orbitalEccentricity * Math.cos(nu);
  positive(radialFactor, "trueAnomalyDegrees");
  return {
    flightPathAngleDegrees: deg(
      Math.atan2(input.orbitalEccentricity * Math.sin(nu), radialFactor),
    ),
  };
};
export const exampleInput = {
  orbitalEccentricity: 0.5,
  trueAnomalyDegrees: 90,
} satisfies Input;
export const exampleOutput = {
  flightPathAngleDegrees: 26.56505117707799,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/conic-flight-path-angle",
  title: "Conic Flight Path Angle",
  description:
    "Compute the conic flight-path angle with a physical positive-radius anomaly constraint for elliptic, parabolic, or hyperbolic eccentricity.",
  inputs: [
    {
      id: "orbitalEccentricity",
      label: "Orbital eccentricity",
      kind: "number",
    },
    { id: "trueAnomalyDegrees", label: "True anomaly degrees", kind: "number" },
  ],
  outputs: [
    {
      id: "flightPathAngleDegrees",
      label: "Flight path angle degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      orbitalEccentricity: value.orbitalEccentricity as number,
      trueAnomalyDegrees: value.trueAnomalyDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;

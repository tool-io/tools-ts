import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { rad, deg, wrap, eccentricity, kepler } from "../shared.js";

export type Input = Readonly<{
  readonly meanAnomalyDegrees: number;
  readonly orbitalEccentricity: number;
}>;
export type Output = Readonly<{
  readonly eccentricAnomalyDegrees: number;
  readonly trueAnomalyDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const e = eccentricity(input.orbitalEccentricity),
    E = kepler(rad(input.meanAnomalyDegrees), e),
    trueAnomalyDegrees = wrap(
      deg(Math.atan2(Math.sqrt(1 - e * e) * Math.sin(E), Math.cos(E) - e)),
    );
  return { eccentricAnomalyDegrees: deg(E), trueAnomalyDegrees };
};
export const exampleInput = {
  meanAnomalyDegrees: 180,
  orbitalEccentricity: 0.5,
} satisfies Input;
export const exampleOutput = {
  eccentricAnomalyDegrees: 180,
  trueAnomalyDegrees: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/elliptic-mean-to-true-anomaly",
  title: "Elliptic Mean To True Anomaly",
  description:
    "Solve elliptic Kepler equation with bounded bisection and convert to wrapped true anomaly; angles are in degrees.",
  inputs: [
    { id: "meanAnomalyDegrees", label: "Mean anomaly degrees", kind: "number" },
    {
      id: "orbitalEccentricity",
      label: "Orbital eccentricity",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "eccentricAnomalyDegrees",
      label: "Eccentric anomaly degrees",
      kind: "number",
    },
    { id: "trueAnomalyDegrees", label: "True anomaly degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      meanAnomalyDegrees: value.meanAnomalyDegrees as number,
      orbitalEccentricity: value.orbitalEccentricity as number,
    }),
});
export const run = tool.execute;
export default tool;

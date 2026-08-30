import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { rad, deg, wrap, eccentricity } from "../shared.js";

export type Input = Readonly<{
  readonly trueAnomalyDegrees: number;
  readonly orbitalEccentricity: number;
}>;
export type Output = Readonly<{
  readonly eccentricAnomalyDegrees: number;
  readonly meanAnomalyDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  const e = eccentricity(input.orbitalEccentricity),
    nu = rad(input.trueAnomalyDegrees),
    E = wrap(
      Math.atan2(Math.sqrt(1 - e * e) * Math.sin(nu), e + Math.cos(nu)),
      2 * Math.PI,
    );
  return {
    eccentricAnomalyDegrees: deg(E),
    meanAnomalyDegrees: deg(E - e * Math.sin(E)),
  };
};
export const exampleInput = {
  trueAnomalyDegrees: 180,
  orbitalEccentricity: 0.5,
} satisfies Input;
export const exampleOutput = {
  eccentricAnomalyDegrees: 180,
  meanAnomalyDegrees: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/elliptic-true-to-eccentric-anomaly",
  title: "Elliptic True To Eccentric Anomaly",
  description:
    "Convert elliptic true anomaly to wrapped eccentric and mean anomaly while preserving the correct quadrant.",
  inputs: [
    { id: "trueAnomalyDegrees", label: "True anomaly degrees", kind: "number" },
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
    { id: "meanAnomalyDegrees", label: "Mean anomaly degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      trueAnomalyDegrees: value.trueAnomalyDegrees as number,
      orbitalEccentricity: value.orbitalEccentricity as number,
    }),
});
export const run = tool.execute;
export default tool;

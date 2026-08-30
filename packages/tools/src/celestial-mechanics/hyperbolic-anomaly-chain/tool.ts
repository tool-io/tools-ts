import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad } from "../shared.js";

export type Input = Readonly<{
  readonly orbitalEccentricity: number;
  readonly trueAnomalyDegrees: number;
}>;
export type Output = Readonly<{
  readonly hyperbolicAnomaly: number;
  readonly hyperbolicMeanAnomaly: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.orbitalEccentricity <= 1 ||
    Math.abs(input.trueAnomalyDegrees) >= 180
  )
    simpleError(
      "orbitalEccentricity",
      "Hyperbolic e>1 and a signed true anomaly within ±180 degrees required.",
    );
  const argument =
    Math.sqrt(
      (input.orbitalEccentricity - 1) / (input.orbitalEccentricity + 1),
    ) * Math.tan(rad(input.trueAnomalyDegrees) / 2);
  if (Math.abs(argument) >= 1)
    simpleError(
      "trueAnomalyDegrees",
      "Anomaly lies at or beyond the hyperbolic asymptote.",
    );
  const hyperbolicAnomaly = 2 * Math.atanh(argument);
  return {
    hyperbolicAnomaly,
    hyperbolicMeanAnomaly:
      input.orbitalEccentricity * Math.sinh(hyperbolicAnomaly) -
      hyperbolicAnomaly,
  };
};
export const exampleInput = {
  orbitalEccentricity: 2,
  trueAnomalyDegrees: 0,
} satisfies Input;
export const exampleOutput = {
  hyperbolicAnomaly: 0,
  hyperbolicMeanAnomaly: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/hyperbolic-anomaly-chain",
  title: "Hyperbolic Anomaly Chain",
  description:
    "Convert a physically accessible signed true anomaly to hyperbolic anomaly H and mean anomaly e·sinh(H)−H, both dimensionless.",
  inputs: [
    {
      id: "orbitalEccentricity",
      label: "Orbital eccentricity",
      kind: "number",
    },
    { id: "trueAnomalyDegrees", label: "True anomaly degrees", kind: "number" },
  ],
  outputs: [
    { id: "hyperbolicAnomaly", label: "Hyperbolic anomaly", kind: "number" },
    {
      id: "hyperbolicMeanAnomaly",
      label: "Hyperbolic mean anomaly",
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

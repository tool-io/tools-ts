import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, wrap } from "../shared.js";

export type Input = Readonly<{
  readonly meanAnomalyDegrees: number;
  readonly orbitalPeriod: number;
}>;
export type Output = Readonly<{
  readonly wrappedMeanAnomalyDegrees: number;
  readonly timeSincePeriapsis: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.orbitalPeriod, "orbitalPeriod");
  const wrappedMeanAnomalyDegrees = wrap(input.meanAnomalyDegrees);
  return {
    wrappedMeanAnomalyDegrees,
    timeSincePeriapsis: (wrappedMeanAnomalyDegrees / 360) * input.orbitalPeriod,
  };
};
export const exampleInput = {
  meanAnomalyDegrees: 450,
  orbitalPeriod: 100,
} satisfies Input;
export const exampleOutput = {
  wrappedMeanAnomalyDegrees: 90,
  timeSincePeriapsis: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/mean-anomaly-periapsis-time",
  title: "Mean Anomaly Periapsis Time",
  description:
    "Map a wrapped elliptic mean anomaly to time since the latest periapsis in the supplied period unit.",
  inputs: [
    { id: "meanAnomalyDegrees", label: "Mean anomaly degrees", kind: "number" },
    { id: "orbitalPeriod", label: "Orbital period", kind: "number" },
  ],
  outputs: [
    {
      id: "wrappedMeanAnomalyDegrees",
      label: "Wrapped mean anomaly degrees",
      kind: "number",
    },
    { id: "timeSincePeriapsis", label: "Time since periapsis", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      meanAnomalyDegrees: value.meanAnomalyDegrees as number,
      orbitalPeriod: value.orbitalPeriod as number,
    }),
});
export const run = tool.execute;
export default tool;

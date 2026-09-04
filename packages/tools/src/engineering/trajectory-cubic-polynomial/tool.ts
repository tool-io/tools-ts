import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly initialPosition: number;
  readonly finalPosition: number;
  readonly initialVelocityPerSecond: number;
  readonly finalVelocityPerSecond: number;
  readonly durationSeconds: number;
  readonly queryElapsedSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly cubicCoefficients: readonly number[];
  readonly samplePositions: readonly number[];
  readonly sampleVelocitiesPerSecond: readonly number[];
}>;
const inputFields = [
  { id: "initialPosition", label: "Initial position", kind: "number" },
  { id: "finalPosition", label: "Final position", kind: "number" },
  {
    id: "initialVelocityPerSecond",
    label: "Initial velocity per second",
    kind: "number",
  },
  {
    id: "finalVelocityPerSecond",
    label: "Final velocity per second",
    kind: "number",
  },
  { id: "durationSeconds", label: "Duration seconds", kind: "number" },
  {
    id: "queryElapsedSeconds",
    label: "Query elapsed seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.durationSeconds, "durationSeconds");
  input.queryElapsedSeconds.forEach((v) =>
    nonnegative(v, "queryElapsedSeconds"),
  );
  if (input.queryElapsedSeconds.some((t) => t > input.durationSeconds))
    simpleError("query", "No trajectory extrapolation.");
  const T = input.durationSeconds,
    d = input.finalPosition - input.initialPosition,
    v0 = input.initialVelocityPerSecond,
    v1 = input.finalVelocityPerSecond,
    a2 = (3 * d) / T ** 2 - (2 * v0 + v1) / T,
    a3 = (-2 * d) / T ** 3 + (v0 + v1) / T ** 2;
  return {
    cubicCoefficients: [input.initialPosition, v0, a2, a3],
    samplePositions: input.queryElapsedSeconds.map(
      (t) => input.initialPosition + t * (v0 + t * (a2 + t * a3)),
    ),
    sampleVelocitiesPerSecond: input.queryElapsedSeconds.map(
      (t) => v0 + t * (2 * a2 + 3 * t * a3),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialPosition: 0,
  finalPosition: 1,
  initialVelocityPerSecond: 0,
  finalVelocityPerSecond: 0,
  durationSeconds: 2,
  queryElapsedSeconds: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  cubicCoefficients: [0, 0, 0.75, -0.25],
  samplePositions: [0, 0.5, 1],
  sampleVelocitiesPerSecond: [0, 0.75, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/trajectory-cubic-polynomial",
  title: "Cubic Trajectory Polynomial Calculator",
  description:
    "Endpoint position/velocity cubic polynomial and bounded sampled motion, coefficient order ascending; no feasible acceleration/actuator limits implied. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "cubicCoefficients",
      label: "Cubic coefficients",
      kind: "numberList",
    },
    { id: "samplePositions", label: "Sample positions", kind: "numberList" },
    {
      id: "sampleVelocitiesPerSecond",
      label: "Sample velocities per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      initialPosition: value.initialPosition as number,
      finalPosition: value.finalPosition as number,
      initialVelocityPerSecond: value.initialVelocityPerSecond as number,
      finalVelocityPerSecond: value.finalVelocityPerSecond as number,
      durationSeconds: value.durationSeconds as number,
      queryElapsedSeconds: value.queryElapsedSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly stimulationDistanceMm: number;
  readonly proximalOnsetLatencyMs: number;
  readonly distalOnsetLatencyMs: number;
  readonly distanceStandardErrorMm: number;
  readonly latencyDifferenceStandardErrorMs: number;
}>;
export type Output = Readonly<{
  readonly latencyDifferenceMs: number;
  readonly velocityMetersPerSecond: number;
  readonly linearVelocityStandardError: number;
}>;
const inputFields = [
  {
    id: "stimulationDistanceMm",
    label: "Stimulation distance mm",
    kind: "number",
  },
  {
    id: "proximalOnsetLatencyMs",
    label: "Proximal onset latency ms",
    kind: "number",
  },
  {
    id: "distalOnsetLatencyMs",
    label: "Distal onset latency ms",
    kind: "number",
  },
  {
    id: "distanceStandardErrorMm",
    label: "Distance standard error mm",
    kind: "number",
  },
  {
    id: "latencyDifferenceStandardErrorMs",
    label: "Latency difference standard error ms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.stimulationDistanceMm, "stimulationDistanceMm");
  nonnegative(input.distalOnsetLatencyMs, "distalOnsetLatencyMs");
  nonnegative(input.distanceStandardErrorMm, "distanceStandardErrorMm");
  nonnegative(
    input.latencyDifferenceStandardErrorMs,
    "latencyDifferenceStandardErrorMs",
  );
  const latencyDifferenceMs = positive(
      input.proximalOnsetLatencyMs - input.distalOnsetLatencyMs,
      "proximalOnsetLatencyMs",
    ),
    velocityMetersPerSecond = input.stimulationDistanceMm / latencyDifferenceMs;
  return {
    latencyDifferenceMs,
    velocityMetersPerSecond,
    linearVelocityStandardError:
      velocityMetersPerSecond *
      Math.hypot(
        input.distanceStandardErrorMm / input.stimulationDistanceMm,
        input.latencyDifferenceStandardErrorMs / latencyDifferenceMs,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stimulationDistanceMm: 200,
  proximalOnsetLatencyMs: 6,
  distalOnsetLatencyMs: 2,
  distanceStandardErrorMm: 2,
  latencyDifferenceStandardErrorMs: 0.1,
} satisfies Input;
export const exampleOutput = {
  latencyDifferenceMs: 4,
  velocityMetersPerSecond: 50,
  linearVelocityStandardError: 1.346291201783626,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/measured-nerve-conduction-velocity",
  title: "Nerve Conduction Velocity",
  description:
    "Measure segmental nerve velocity from inter-stimulation distance and onset-latency difference, with independent first-order uncertainty; not a diameter-based estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "latencyDifferenceMs",
      label: "Latency difference ms",
      kind: "number",
    },
    {
      id: "velocityMetersPerSecond",
      label: "Velocity meters per second",
      kind: "number",
    },
    {
      id: "linearVelocityStandardError",
      label: "Linear velocity standard error",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stimulationDistanceMm: value.stimulationDistanceMm as number,
      proximalOnsetLatencyMs: value.proximalOnsetLatencyMs as number,
      distalOnsetLatencyMs: value.distalOnsetLatencyMs as number,
      distanceStandardErrorMm: value.distanceStandardErrorMm as number,
      latencyDifferenceStandardErrorMs:
        value.latencyDifferenceStandardErrorMs as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly poolLengthMeters: number;
  readonly callerTargetSwimMeters: number;
  readonly observedCompletedLengths: number;
}>;
export type Output = Readonly<{
  readonly requiredWholeLengths: number;
  readonly plannedWholeLengthDistanceMeters: number;
  readonly remainingWholeLengths: number;
  readonly distanceOverCallerTargetMeters: number;
}>;
const inputFields = [
  { id: "poolLengthMeters", label: "Pool length meters", kind: "number" },
  {
    id: "callerTargetSwimMeters",
    label: "Caller target swim meters",
    kind: "number",
  },
  {
    id: "observedCompletedLengths",
    label: "Observed completed lengths",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.poolLengthMeters, "poolLengthMeters");
  nonnegative(input.callerTargetSwimMeters, "callerTargetSwimMeters");
  bounded(input.observedCompletedLengths, "lengths", 0, 1000000);
  const count = bounded(
    Math.ceil(input.callerTargetSwimMeters / input.poolLengthMeters),
    "lengths",
    0,
    1000000,
  );
  return {
    requiredWholeLengths: count,
    plannedWholeLengthDistanceMeters: count * input.poolLengthMeters,
    remainingWholeLengths: Math.max(0, count - input.observedCompletedLengths),
    distanceOverCallerTargetMeters:
      count * input.poolLengthMeters - input.callerTargetSwimMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  poolLengthMeters: 25,
  callerTargetSwimMeters: 110,
  observedCompletedLengths: 3,
} satisfies Input;
export const exampleOutput = {
  requiredWholeLengths: 5,
  plannedWholeLengthDistanceMeters: 125,
  remainingWholeLengths: 2,
  distanceOverCallerTargetMeters: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/lap-pool-length-count",
  title: "Lap Pool Length Count Tool",
  description:
    "Reconcile actual pool length and completed one-way lengths against whole-length distance goal; laps not silently doubled and target overshoot explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeLengths",
      label: "Required whole lengths",
      kind: "number",
    },
    {
      id: "plannedWholeLengthDistanceMeters",
      label: "Planned whole length distance meters",
      kind: "number",
    },
    {
      id: "remainingWholeLengths",
      label: "Remaining whole lengths",
      kind: "number",
    },
    {
      id: "distanceOverCallerTargetMeters",
      label: "Distance over caller target meters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      poolLengthMeters: value.poolLengthMeters as number,
      callerTargetSwimMeters: value.callerTargetSwimMeters as number,
      observedCompletedLengths: value.observedCompletedLengths as number,
    }),
});
export const run = tool.execute;
export default tool;

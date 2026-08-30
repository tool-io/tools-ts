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
  aligned,
  sum,
  ledger,
} from "../shared.js";
export type Input = Readonly<{
  readonly routeSegmentLengthsM: readonly number[];
  readonly segmentWalkingSpeedsMPerMinute: readonly number[];
  readonly stopDwellMinutes: readonly number[];
  readonly fixedQueueMinutes: number;
}>;
export type Output = Readonly<{
  readonly totalRouteLengthM: number;
  readonly totalMovingMinutes: number;
  readonly totalVisitScenarioMinutes: number;
}>;
const inputFields = [
  {
    id: "routeSegmentLengthsM",
    label: "Route segment lengths m",
    kind: "numberList",
  },
  {
    id: "segmentWalkingSpeedsMPerMinute",
    label: "Segment walking speeds m per minute",
    kind: "numberList",
  },
  { id: "stopDwellMinutes", label: "Stop dwell minutes", kind: "numberList" },
  { id: "fixedQueueMinutes", label: "Fixed queue minutes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.segmentWalkingSpeedsMPerMinute.forEach((v) =>
    positive(v, "segmentWalkingSpeedsMPerMinute"),
  );
  input.routeSegmentLengthsM.forEach((v) =>
    nonnegative(v, "routeSegmentLengthsM"),
  );
  input.stopDwellMinutes.forEach((v) => nonnegative(v, "stopDwellMinutes"));
  nonnegative(input.fixedQueueMinutes, "fixedQueueMinutes");
  aligned(
    input.routeSegmentLengthsM,
    input.segmentWalkingSpeedsMPerMinute,
    "routeSegmentLengthsM",
  );
  if (!input.stopDwellMinutes.length)
    simpleError("stops", "Explicit stop dwell ledger required.");
  const moving = input.routeSegmentLengthsM.reduce(
    (s, v, i) => s + v / input.segmentWalkingSpeedsMPerMinute[i],
    0,
  );
  return {
    totalRouteLengthM: sum(input.routeSegmentLengthsM),
    totalMovingMinutes: moving,
    totalVisitScenarioMinutes:
      moving + sum(input.stopDwellMinutes) + input.fixedQueueMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  routeSegmentLengthsM: [100, 200],
  segmentWalkingSpeedsMPerMinute: [50, 100],
  stopDwellMinutes: [2, 3],
  fixedQueueMinutes: 1,
} satisfies Input;
export const exampleOutput = {
  totalRouteLengthM: 300,
  totalMovingMinutes: 4,
  totalVisitScenarioMinutes: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/route-loop-walking-time",
  title: "Gallery Route Loop Length Walking Time Calculator",
  description:
    "Budget segment-specific walking exposure plus independent stop/queue ledger, rather than one average-speed geometric route; no accessibility, evacuation or visitor timing guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "totalRouteLengthM", label: "Total route length m", kind: "number" },
    { id: "totalMovingMinutes", label: "Total moving minutes", kind: "number" },
    {
      id: "totalVisitScenarioMinutes",
      label: "Total visit scenario minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      routeSegmentLengthsM: value.routeSegmentLengthsM as readonly number[],
      segmentWalkingSpeedsMPerMinute:
        value.segmentWalkingSpeedsMPerMinute as readonly number[],
      stopDwellMinutes: value.stopDwellMinutes as readonly number[],
      fixedQueueMinutes: value.fixedQueueMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;

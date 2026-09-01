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
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly measuredLaneCenterlineRadiiMeters: readonly number[];
  readonly callerCurvedArcRadians: number;
}>;
export type Output = Readonly<{
  readonly centerlineStaggersFromInnerLaneMeters: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredLaneCenterlineRadiiMeters",
    label: "Measured lane centerline radii meters",
    kind: "numberList",
  },
  {
    id: "callerCurvedArcRadians",
    label: "Caller curved arc radians",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredLaneCenterlineRadiiMeters.forEach((v) =>
    positive(v, "measuredLaneCenterlineRadiiMeters"),
  );
  positive(input.callerCurvedArcRadians, "callerCurvedArcRadians");
  strictlyIncreasing(input.measuredLaneCenterlineRadiiMeters, "radii", 1);
  if (input.callerCurvedArcRadians > 2 * Math.PI)
    simpleError(
      "arc",
      "At most one revolution of caller curved running arc required.",
    );
  return {
    centerlineStaggersFromInnerLaneMeters:
      input.measuredLaneCenterlineRadiiMeters.map(
        (v) =>
          (v - input.measuredLaneCenterlineRadiiMeters[0]) *
          input.callerCurvedArcRadians,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredLaneCenterlineRadiiMeters: [36, 37, 38],
  callerCurvedArcRadians: 6.283185307179586,
} satisfies Input;
export const exampleOutput = {
  centerlineStaggersFromInnerLaneMeters: [
    0, 6.283185307179586, 12.566370614359172,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/track-lane-stagger-distance-400m",
  title: "400m Lane Stagger Distance",
  description:
    "Compute ideal actual lane-centerline curved-distance differences under caller total curved arc; not official start-line stagger with measurement offsets, track certification or geodesy.",
  inputs: inputFields,
  outputs: [
    {
      id: "centerlineStaggersFromInnerLaneMeters",
      label: "Centerline staggers from inner lane meters",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredLaneCenterlineRadiiMeters:
        value.measuredLaneCenterlineRadiiMeters as readonly number[],
      callerCurvedArcRadians: value.callerCurvedArcRadians as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  shape,
  fit,
} from "../shared.js";
export type Input = Readonly<{
  readonly taskCoordinatesCm: readonly (readonly number[])[];
  readonly primaryReachOuterRadiusCm: number;
  readonly callerExcludedInnerRadiusCm: number;
}>;
export type Output = Readonly<{
  readonly taskRadialDistancesCm: readonly number[];
  readonly insideCallerPrimaryReachFlags: readonly number[];
  readonly outsideReachTaskIndices: readonly number[];
}>;
const inputFields = [
  { id: "taskCoordinatesCm", label: "Task coordinates cm", kind: "matrix" },
  {
    id: "primaryReachOuterRadiusCm",
    label: "Primary reach outer radius cm",
    kind: "number",
  },
  {
    id: "callerExcludedInnerRadiusCm",
    label: "Caller excluded inner radius cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.primaryReachOuterRadiusCm, "primaryReachOuterRadiusCm");
  nonnegative(input.callerExcludedInnerRadiusCm, "callerExcludedInnerRadiusCm");
  if (
    shape(input.taskCoordinatesCm, "tasks") !== 2 ||
    input.callerExcludedInnerRadiusCm > input.primaryReachOuterRadiusCm
  )
    simpleError(
      "reach",
      "Planar task pairs and ordered inner/outer reach radii required.",
    );
  const d = input.taskCoordinatesCm.map((r) => Math.hypot(...r)),
    flags = fit(
      d,
      input.callerExcludedInnerRadiusCm,
      input.primaryReachOuterRadiusCm,
    );
  return {
    taskRadialDistancesCm: d,
    insideCallerPrimaryReachFlags: flags,
    outsideReachTaskIndices: flags.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  taskCoordinatesCm: [
    [30, 0],
    [50, 0],
    [0, 10],
  ],
  primaryReachOuterRadiusCm: 40,
  callerExcludedInnerRadiusCm: 15,
} satisfies Input;
export const exampleOutput = {
  taskRadialDistancesCm: [30, 50, 10],
  insideCallerPrimaryReachFlags: [1, 0, 0],
  outsideReachTaskIndices: [1, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reach-primary-envelope-checker",
  title: "Reach Zone Primary Envelope Radius Checker",
  description:
    "Audit actual planar task coordinates against caller measured reachable annulus, retaining too-near and too-far tasks; shoulder origin/obstructions assumed caller-defined, not generic optimal reach or safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "taskRadialDistancesCm",
      label: "Task radial distances cm",
      kind: "numberList",
    },
    {
      id: "insideCallerPrimaryReachFlags",
      label: "Inside caller primary reach flags",
      kind: "numberList",
    },
    {
      id: "outsideReachTaskIndices",
      label: "Outside reach task indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      taskCoordinatesCm:
        value.taskCoordinatesCm as readonly (readonly number[])[],
      primaryReachOuterRadiusCm: value.primaryReachOuterRadiusCm as number,
      callerExcludedInnerRadiusCm: value.callerExcludedInnerRadiusCm as number,
    }),
});
export const run = tool.execute;
export default tool;

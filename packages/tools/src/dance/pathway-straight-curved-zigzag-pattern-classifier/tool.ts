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
  bounded,
  points,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedLocalPathPointsM: readonly (readonly number[])[];
  readonly callerStraightTurnToleranceDegrees: number;
  readonly callerMinimumZigzagDirectionChanges: number;
}>;
export type Output = Readonly<{
  readonly signedInteriorPathTurnsDegrees: readonly number[];
  readonly pathTurnDirectionChanges: number;
  readonly callerPathShapeClass: string;
}>;
const inputFields = [
  {
    id: "observedLocalPathPointsM",
    label: "Observed local path points m",
    kind: "matrix",
  },
  {
    id: "callerStraightTurnToleranceDegrees",
    label: "Caller straight turn tolerance degrees",
    kind: "number",
  },
  {
    id: "callerMinimumZigzagDirectionChanges",
    label: "Caller minimum zigzag direction changes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerStraightTurnToleranceDegrees,
    "callerStraightTurnToleranceDegrees",
  );
  points(input.observedLocalPathPointsM);
  if (
    input.observedLocalPathPointsM.length < 3 ||
    input.callerStraightTurnToleranceDegrees >= 90
  )
    simpleError(
      "path",
      "At least three actual path points and turn tolerance <90 required.",
    );
  bounded(input.callerMinimumZigzagDirectionChanges, "changes", 1, 126);
  const vectors = input.observedLocalPathPointsM.slice(1).map((p, i) => {
    const dx = p[0] - input.observedLocalPathPointsM[i][0],
      dy = p[1] - input.observedLocalPathPointsM[i][1],
      length = Math.hypot(dx, dy);
    if (!Number.isFinite(length) || length === 0)
      simpleError("path", "Finite nonzero consecutive path segments required.");
    return [dx / length, dy / length];
  });
  const turns = vectors
      .slice(1)
      .map(
        (v, i) =>
          (Math.atan2(
            vectors[i][0] * v[1] - vectors[i][1] * v[0],
            vectors[i][0] * v[0] + vectors[i][1] * v[1],
          ) *
            180) /
          Math.PI,
      ),
    signs = turns
      .filter((v) => Math.abs(v) > input.callerStraightTurnToleranceDegrees)
      .map(Math.sign),
    changes = signs.slice(1).filter((v, i) => v !== signs[i]).length;
  return {
    signedInteriorPathTurnsDegrees: turns,
    pathTurnDirectionChanges: changes,
    callerPathShapeClass: !signs.length
      ? "straight"
      : changes >= input.callerMinimumZigzagDirectionChanges
        ? "zigzag"
        : "curved-or-single-turn",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLocalPathPointsM: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  callerStraightTurnToleranceDegrees: 5,
  callerMinimumZigzagDirectionChanges: 1,
} satisfies Input;
export const exampleOutput = {
  signedInteriorPathTurnsDegrees: [90, -90],
  pathTurnDirectionChanges: 1,
  callerPathShapeClass: "zigzag",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/pathway-straight-curved-zigzag-pattern-classifier",
  title: "Pathway Straight Curved Zigzag Pattern Classifier",
  description:
    "Classify actual sampled local planar dance path by caller turn tolerance and alternating-turn count; sampling-dependent screen, no spline curvature proof, coordinate transformation or collision safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedInteriorPathTurnsDegrees",
      label: "Signed interior path turns degrees",
      kind: "numberList",
    },
    {
      id: "pathTurnDirectionChanges",
      label: "Path turn direction changes",
      kind: "number",
    },
    {
      id: "callerPathShapeClass",
      label: "Caller path shape class",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLocalPathPointsM:
        value.observedLocalPathPointsM as readonly (readonly number[])[],
      callerStraightTurnToleranceDegrees:
        value.callerStraightTurnToleranceDegrees as number,
      callerMinimumZigzagDirectionChanges:
        value.callerMinimumZigzagDirectionChanges as number,
    }),
});
export const run = tool.execute;
export default tool;

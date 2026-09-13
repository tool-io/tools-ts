import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredGazeVector: readonly number[];
  readonly actualIndependentTargetVector: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredGazeVector",
    label: "Actual measured gaze vector",
    kind: "numberList",
  },
  {
    id: "actualIndependentTargetVector",
    label: "Actual independent target vector",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualMeasuredGazeVector.length)
    simpleError("actualMeasuredGazeVector", "Actual nonempty observations.");
  if (!input.actualIndependentTargetVector.length)
    simpleError(
      "actualIndependentTargetVector",
      "Actual nonempty observations.",
    );
  if (
    input.actualMeasuredGazeVector.length !== 3 ||
    input.actualIndependentTargetVector.length !== 3
  )
    simpleError("gaze", "Actual3Dmatchedvectors.");
  positive(Math.hypot(...input.actualMeasuredGazeVector), "gaze");
  positive(Math.hypot(...input.actualIndependentTargetVector), "target");
  return {
    value:
      (Math.acos(
        Math.max(
          -1,
          Math.min(
            1,
            sum(
              input.actualMeasuredGazeVector.map(
                (v, i) => v * input.actualIndependentTargetVector[i],
              ),
            ) /
              (Math.hypot(...input.actualMeasuredGazeVector) *
                Math.hypot(...input.actualIndependentTargetVector)),
          ),
        ),
      ) *
        180) /
      Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredGazeVector: [1, 0, 0],
    actualIndependentTargetVector: [0, 1, 0],
  },
  output: { result: { value: 90 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/eye-tracking-accuracy-degrees",
  title: "Eye Tracking Accuracy Degrees Calculator",
  description:
    "Actual nonzero3Dgazevectorangularerroragainst independently matched target degrees, do tangle not precision/latency.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

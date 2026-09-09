import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  bounded,
  positive,
  strictlyIncreasing,
  referenceInterpolation,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredTimeSeconds: readonly number[];
  readonly independentlyMeasuredForcesNewtons: readonly number[];
  readonly callerDefinedWindowBoundsSeconds: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredTimeSeconds",
    label: "Independently measured time seconds",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredForcesNewtons",
    label: "Independently measured forces newtons",
    kind: "numberList",
  },
  {
    id: "callerDefinedWindowBoundsSeconds",
    label: "Caller defined window bounds seconds",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredTimeSeconds,
    input.independentlyMeasuredForcesNewtons,
    "trace",
  );
  strictlyIncreasing(input.independentlyMeasuredTimeSeconds, "time", 2);
  if (
    input.callerDefinedWindowBoundsSeconds.some(
      (r) => r.length !== 2 || r[1] <= r[0],
    )
  )
    simpleError(
      "windows",
      "Declared positive-duration bounded two-endpoint windows.",
    );
  return {
    observedWindowForceDevelopmentNewtonsPerSecond:
      input.callerDefinedWindowBoundsSeconds.map(
        (r) =>
          (referenceInterpolation(
            input.independentlyMeasuredTimeSeconds,
            input.independentlyMeasuredForcesNewtons,
            r[1],
          ) -
            referenceInterpolation(
              input.independentlyMeasuredTimeSeconds,
              input.independentlyMeasuredForcesNewtons,
              r[0],
            )) /
          (r[1] - r[0]),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredTimeSeconds: [0, 0.1, 0.2],
    independentlyMeasuredForcesNewtons: [0, 10, 30],
    callerDefinedWindowBoundsSeconds: [
      [0, 0.1],
      [0.1, 0.2],
    ],
  },
  output: {
    result: { observedWindowForceDevelopmentNewtonsPerSecond: [100, 200] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/rate-of-force-development-early-late-phase-windows",
  title: "Rate of Force Development Early Late Phase Windows",
  description:
    "Actual early/late RFDwindow endpoint differences over elapsed seconds, piecewise-linear observed force interpolation. Exact window definitions/onset calibration required; no universally optimal windows, injury diagnosis or maximal-force prescription.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

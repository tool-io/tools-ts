import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredLidApertureMm: number;
  readonly callerMeasuredClosedBaselineMm: number;
  readonly callerMeasuredOpenBaselineMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredLidApertureMm",
    label: "Actual measured lid aperture mm",
    kind: "number",
  },
  {
    id: "callerMeasuredClosedBaselineMm",
    label: "Caller measured closed baseline mm",
    kind: "number",
  },
  {
    id: "callerMeasuredOpenBaselineMm",
    label: "Caller measured open baseline mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMeasuredLidApertureMm, "actualMeasuredLidApertureMm");
  nonnegative(
    input.callerMeasuredClosedBaselineMm,
    "callerMeasuredClosedBaselineMm",
  );
  positive(input.callerMeasuredOpenBaselineMm, "callerMeasuredOpenBaselineMm");
  if (
    input.callerMeasuredOpenBaselineMm <= input.callerMeasuredClosedBaselineMm
  )
    simpleError("baselines", "Actualopen>closed.");
  return {
    value:
      100 *
      Math.max(
        0,
        Math.min(
          1,
          (input.actualMeasuredLidApertureMm -
            input.callerMeasuredClosedBaselineMm) /
            (input.callerMeasuredOpenBaselineMm -
              input.callerMeasuredClosedBaselineMm),
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredLidApertureMm: 2,
    callerMeasuredClosedBaselineMm: 1,
    callerMeasuredOpenBaselineMm: 3,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/eye-openness-percentage",
  title: "Eye Openness Percentage Calculator",
  description:
    "Actual individually calibrated eyelid aperture normalized0\u2013100openness, clamped; not uncalibratedretinaltracking or fatigue/identity inference.",
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

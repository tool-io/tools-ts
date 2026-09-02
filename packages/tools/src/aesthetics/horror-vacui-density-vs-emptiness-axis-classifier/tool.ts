import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  simpleError,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyMeasuredOccupiedDisjointArea: number;
  readonly actualMeasuredFieldArea: number;
  readonly callerDenseThreshold: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredOccupiedDisjointArea",
    label: "Independently measured occupied disjoint area",
    kind: "number",
  },
  {
    id: "actualMeasuredFieldArea",
    label: "Actual measured field area",
    kind: "number",
  },
  {
    id: "callerDenseThreshold",
    label: "Caller dense threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualMeasuredFieldArea, "fieldarea");
  nonnegative(input.independentlyMeasuredOccupiedDisjointArea, "occupiedarea");
  fraction(input.callerDenseThreshold, "threshold");
  if (
    input.independentlyMeasuredOccupiedDisjointArea >
    input.actualMeasuredFieldArea
  )
    simpleError("area", "Occupied disjoint area within measured field.");
  return {
    observedOccupiedFraction:
      input.independentlyMeasuredOccupiedDisjointArea /
      input.actualMeasuredFieldArea,
    meetsCallerDenseThreshold:
      input.independentlyMeasuredOccupiedDisjointArea /
        input.actualMeasuredFieldArea >=
      input.callerDenseThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredOccupiedDisjointArea: 75,
    actualMeasuredFieldArea: 100,
    callerDenseThreshold: 0.7,
  },
  output: {
    result: { observedOccupiedFraction: 0.75, meetsCallerDenseThreshold: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/horror-vacui-density-vs-emptiness-axis-classifier",
  title: "Horror Vacui Density vs Emptiness Axis Classifier",
  description:
    "Observed occupied area fraction against a declared caller density threshold, not universal horror-vacui classification or cultural intent. Actual disjoint area and field basis required.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

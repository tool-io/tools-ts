import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  aligned,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualDisjointSurveyCellAreasSquareMeters: readonly number[];
  readonly actualObservedCellMeanDepthsMeters: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDisjointSurveyCellAreasSquareMeters",
    label: "Actual disjoint survey cell areas square meters",
    kind: "numberList",
  },
  {
    id: "actualObservedCellMeanDepthsMeters",
    label: "Actual observed cell mean depths meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (!input.actualDisjointSurveyCellAreasSquareMeters.length)
    simpleError(
      "actualDisjointSurveyCellAreasSquareMeters",
      "Actual nonempty observations.",
    );
  input.actualDisjointSurveyCellAreasSquareMeters.forEach((v) =>
    nonnegative(v, "actualDisjointSurveyCellAreasSquareMeters"),
  );
  if (!input.actualObservedCellMeanDepthsMeters.length)
    simpleError(
      "actualObservedCellMeanDepthsMeters",
      "Actual nonempty observations.",
    );
  input.actualObservedCellMeanDepthsMeters.forEach((v) =>
    nonnegative(v, "actualObservedCellMeanDepthsMeters"),
  );
  aligned(
    input.actualDisjointSurveyCellAreasSquareMeters,
    input.actualObservedCellMeanDepthsMeters,
    "cells",
  );
  return {
    value: sum(
      input.actualDisjointSurveyCellAreasSquareMeters.map(
        (v, i) => v * input.actualObservedCellMeanDepthsMeters[i],
      ),
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDisjointSurveyCellAreasSquareMeters: [1, 2],
    actualObservedCellMeanDepthsMeters: [2, 2],
  },
  output: { result: { value: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/pond-volume",
  title: "Pond Volume Calculator",
  description:
    "Surveyed actual pond volume by disjoint plan area\u00d7independently observed cell mean depth, no automatically assume tapered/geometric pond.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

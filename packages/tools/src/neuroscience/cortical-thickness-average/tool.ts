import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredVertexThicknessMm: readonly number[];
  readonly matchedRepresentedSurfaceAreasSquareMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredVertexThicknessMm",
    label: "Independently measured vertex thickness mm",
    kind: "numberList",
  },
  {
    id: "matchedRepresentedSurfaceAreasSquareMm",
    label: "Matched represented surface areas square mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredVertexThicknessMm,
    input.matchedRepresentedSurfaceAreasSquareMm,
    "surface",
  );
  [
    input.independentlyMeasuredVertexThicknessMm,
    input.matchedRepresentedSurfaceAreasSquareMm,
  ].forEach((v) => v.forEach((x) => nonnegative(x, "measurement")));
  return {
    observedAreaWeightedCorticalThicknessMm:
      sum(
        input.independentlyMeasuredVertexThicknessMm.map(
          (v, i) => v * input.matchedRepresentedSurfaceAreasSquareMm[i],
        ),
      ) / positive(sum(input.matchedRepresentedSurfaceAreasSquareMm), "area"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredVertexThicknessMm: [2, 4],
    matchedRepresentedSurfaceAreasSquareMm: [3, 1],
  },
  output: { result: { observedAreaWeightedCorticalThicknessMm: 2.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/cortical-thickness-average",
  title: "Average Cortical Thickness Calculator",
  description:
    "Actual cortex thickness pooled by independently represented surface area, not an unweighted vertex mean or thickness estimated from cortical volume/area. Surface/vertex matching and image processing external.",
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

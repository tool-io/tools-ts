import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyMeasuredFurRegionAreas: readonly number[];
  readonly independentlyMeasuredWholeFieldArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredFurRegionAreas",
    label: "Independently measured fur region areas",
    kind: "numberList",
  },
  {
    id: "independentlyMeasuredWholeFieldArea",
    label: "Independently measured whole field area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.independentlyMeasuredWholeFieldArea,
    "independentlyMeasuredWholeFieldArea",
  );
  input.independentlyMeasuredFurRegionAreas.forEach((v) =>
    nonnegative(v, "independentlyMeasuredFurRegionAreas"),
  );
  const total = sum(input.independentlyMeasuredFurRegionAreas);
  if (total > input.independentlyMeasuredWholeFieldArea)
    simpleError(
      "areas",
      "Disjoint fur regions cannot exceed actual field area.",
    );
  return {
    furCoverageFraction: total / input.independentlyMeasuredWholeFieldArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredFurRegionAreas: [10, 20],
    independentlyMeasuredWholeFieldArea: 100,
  },
  output: { result: { furCoverageFraction: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/fur-area-coverage-analyzer",
  title: "Heraldic Fur Area Coverage Analyzer",
  description:
    "Sum independently disjoint measured fur regions over true field area, not fill-area inference from a bounding box.",
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

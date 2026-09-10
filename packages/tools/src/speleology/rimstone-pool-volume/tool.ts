import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTerracedPoolPlanAreasSquareMeters: readonly number[];
  readonly callerMeasuredMeanWaterDepthsMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTerracedPoolPlanAreasSquareMeters",
    label: "Actual terraced pool plan areas square meters",
    kind: "numberList",
  },
  {
    id: "callerMeasuredMeanWaterDepthsMeters",
    label: "Caller measured mean water depths meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualTerracedPoolPlanAreasSquareMeters,
    input.callerMeasuredMeanWaterDepthsMeters,
    "pools",
  );
  input.actualTerracedPoolPlanAreasSquareMeters.forEach((v) =>
    nonnegative(v, "area"),
  );
  input.callerMeasuredMeanWaterDepthsMeters.forEach((v) =>
    nonnegative(v, "mean-depth"),
  );
  return {
    conditionalTerracedPoolWaterVolumeCubicMeters: sum(
      input.actualTerracedPoolPlanAreasSquareMeters.map(
        (v, i) => v * input.callerMeasuredMeanWaterDepthsMeters[i],
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
    actualTerracedPoolPlanAreasSquareMeters: [2, 3],
    callerMeasuredMeanWaterDepthsMeters: [1, 2],
  },
  output: { result: { conditionalTerracedPoolWaterVolumeCubicMeters: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/rimstone-pool-volume",
  title: "Rimstone Dam Pool Volume Terraced Calculator",
  description:
    "Actual disjoint terraced pool areas\u00d7independently measured areamean waterdepths, not maxdepth or overflowing hydraulic discharge.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

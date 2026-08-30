import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly graftedCuttingCountsByBatch: readonly number[];
  readonly unionTakeCountsByBatch: readonly number[];
  readonly rootedTakeCountsByBatch: readonly number[];
  readonly saleableRootedCountsByBatch: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledUnionTakePercent: number;
  readonly pooledRootedConversionPercent: number;
  readonly pooledSaleableGraftSuccessPercent: number;
  readonly postUnionRootingAttritionCount: number;
  readonly postRootingGradeAttritionCount: number;
}>;
const inputFields = [
  {
    id: "graftedCuttingCountsByBatch",
    label: "Grafted cutting counts by batch",
    kind: "numberList",
  },
  {
    id: "unionTakeCountsByBatch",
    label: "Union take counts by batch",
    kind: "numberList",
  },
  {
    id: "rootedTakeCountsByBatch",
    label: "Rooted take counts by batch",
    kind: "numberList",
  },
  {
    id: "saleableRootedCountsByBatch",
    label: "Saleable rooted counts by batch",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.graftedCuttingCountsByBatch.forEach((v) =>
    count(v, "graftedCuttingCountsByBatch"),
  );
  input.unionTakeCountsByBatch.forEach((v) =>
    count(v, "unionTakeCountsByBatch"),
  );
  input.rootedTakeCountsByBatch.forEach((v) =>
    count(v, "rootedTakeCountsByBatch"),
  );
  input.saleableRootedCountsByBatch.forEach((v) =>
    count(v, "saleableRootedCountsByBatch"),
  );
  aligned(
    input.graftedCuttingCountsByBatch,
    input.unionTakeCountsByBatch,
    "graftedCuttingCountsByBatch",
  );
  aligned(
    input.graftedCuttingCountsByBatch,
    input.rootedTakeCountsByBatch,
    "graftedCuttingCountsByBatch",
  );
  aligned(
    input.graftedCuttingCountsByBatch,
    input.saleableRootedCountsByBatch,
    "graftedCuttingCountsByBatch",
  );
  input.graftedCuttingCountsByBatch.forEach((n, i) => {
    if (
      input.unionTakeCountsByBatch[i] > n ||
      input.rootedTakeCountsByBatch[i] > input.unionTakeCountsByBatch[i] ||
      input.saleableRootedCountsByBatch[i] > input.rootedTakeCountsByBatch[i]
    )
      simpleError(
        "pipeline",
        "Nested graft-union, rooted and saleable counts required.",
      );
  });
  const total = count(
      input.graftedCuttingCountsByBatch.reduce((a, b) => a + b, 0),
      "attempts",
      1,
    ),
    u = input.unionTakeCountsByBatch.reduce((a, b) => a + b, 0),
    r = input.rootedTakeCountsByBatch.reduce((a, b) => a + b, 0),
    s = input.saleableRootedCountsByBatch.reduce((a, b) => a + b, 0);
  return {
    pooledUnionTakePercent: (100 * u) / total,
    pooledRootedConversionPercent: (100 * r) / total,
    pooledSaleableGraftSuccessPercent: (100 * s) / total,
    postUnionRootingAttritionCount: u - r,
    postRootingGradeAttritionCount: r - s,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  graftedCuttingCountsByBatch: [100, 200],
  unionTakeCountsByBatch: [80, 150],
  rootedTakeCountsByBatch: [60, 100],
  saleableRootedCountsByBatch: [50, 90],
} satisfies Input;
export const exampleOutput = {
  pooledUnionTakePercent: 76.66666666666667,
  pooledRootedConversionPercent: 53.333333333333336,
  pooledSaleableGraftSuccessPercent: 46.666666666666664,
  postUnionRootingAttritionCount: 70,
  postRootingGradeAttritionCount: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/graft-success-rate-percent",
  title: "Graft Success Rate Percent",
  description:
    "Audit multi-batch graft take→rooting→saleable nested pipeline and distinct attrition, not simple binary seedling survival; unequal batch sizes are pooled by attempted grafts and stage quality criteria are caller established.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledUnionTakePercent",
      label: "Pooled union take percent",
      kind: "number",
    },
    {
      id: "pooledRootedConversionPercent",
      label: "Pooled rooted conversion percent",
      kind: "number",
    },
    {
      id: "pooledSaleableGraftSuccessPercent",
      label: "Pooled saleable graft success percent",
      kind: "number",
    },
    {
      id: "postUnionRootingAttritionCount",
      label: "Post union rooting attrition count",
      kind: "number",
    },
    {
      id: "postRootingGradeAttritionCount",
      label: "Post rooting grade attrition count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      graftedCuttingCountsByBatch:
        value.graftedCuttingCountsByBatch as readonly number[],
      unionTakeCountsByBatch: value.unionTakeCountsByBatch as readonly number[],
      rootedTakeCountsByBatch:
        value.rootedTakeCountsByBatch as readonly number[],
      saleableRootedCountsByBatch:
        value.saleableRootedCountsByBatch as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

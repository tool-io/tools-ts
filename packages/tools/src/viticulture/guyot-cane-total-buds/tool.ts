import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, aligned, shape } from "../shared.js";
export type Input = Readonly<{
  readonly retainedFruitCaneBudCountsByVine: readonly (readonly number[])[];
  readonly retainedRenewalSpurBudCountsByVine: readonly number[];
}>;
export type Output = Readonly<{
  readonly fruitCaneBudTotalsByVine: readonly number[];
  readonly wholeGuyotBudTotalsByVine: readonly number[];
  readonly renewalBudShareOfTotal: number;
}>;
const inputFields = [
  {
    id: "retainedFruitCaneBudCountsByVine",
    label: "Retained fruit cane bud counts by vine",
    kind: "matrix",
  },
  {
    id: "retainedRenewalSpurBudCountsByVine",
    label: "Retained renewal spur bud counts by vine",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.retainedRenewalSpurBudCountsByVine.forEach((v) =>
    count(v, "retainedRenewalSpurBudCountsByVine"),
  );
  shape(input.retainedFruitCaneBudCountsByVine, "canes");
  aligned(
    input.retainedFruitCaneBudCountsByVine,
    input.retainedRenewalSpurBudCountsByVine,
    "vines",
  );
  input.retainedFruitCaneBudCountsByVine.forEach((row) =>
    row.forEach((v) => count(v, "budCounts")),
  );
  const fruitCaneBudTotalsByVine = input.retainedFruitCaneBudCountsByVine.map(
      (row) => row.reduce((a, b) => a + b, 0),
    ),
    wholeGuyotBudTotalsByVine = fruitCaneBudTotalsByVine.map(
      (v, i) => v + input.retainedRenewalSpurBudCountsByVine[i],
    ),
    n = count(
      wholeGuyotBudTotalsByVine.reduce((a, b) => a + b, 0),
      "totalBuds",
      1,
    );
  return {
    fruitCaneBudTotalsByVine,
    wholeGuyotBudTotalsByVine,
    renewalBudShareOfTotal:
      input.retainedRenewalSpurBudCountsByVine.reduce((a, b) => a + b, 0) / n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  retainedFruitCaneBudCountsByVine: [
    [6, 8],
    [10, 0],
  ],
  retainedRenewalSpurBudCountsByVine: [2, 4],
} satisfies Input;
export const exampleOutput = {
  fruitCaneBudTotalsByVine: [14, 10],
  wholeGuyotBudTotalsByVine: [16, 14],
  renewalBudShareOfTotal: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/guyot-cane-total-buds",
  title: "Guyot Cane Total Buds",
  description:
    "Account measured multi-cane Guyot retained fruit buds and separate renewal-spur buds by vine; no conflation of renewal with crop buds or prediction of fruitfulness.",
  inputs: inputFields,
  outputs: [
    {
      id: "fruitCaneBudTotalsByVine",
      label: "Fruit cane bud totals by vine",
      kind: "numberList",
    },
    {
      id: "wholeGuyotBudTotalsByVine",
      label: "Whole guyot bud totals by vine",
      kind: "numberList",
    },
    {
      id: "renewalBudShareOfTotal",
      label: "Renewal bud share of total",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      retainedFruitCaneBudCountsByVine:
        value.retainedFruitCaneBudCountsByVine as readonly (readonly number[])[],
      retainedRenewalSpurBudCountsByVine:
        value.retainedRenewalSpurBudCountsByVine as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

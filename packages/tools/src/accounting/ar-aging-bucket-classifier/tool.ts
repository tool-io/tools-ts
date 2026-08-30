import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  aligned,
  ageBuckets,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly invoiceDaysPastDue: readonly number[];
  readonly invoiceAmountsMinor: readonly number[];
  readonly callerInclusiveUpperDayEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly invoiceBucketIndices: readonly number[];
  readonly amountTotalsByBucketMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "invoiceDaysPastDue",
    label: "Invoice days past due",
    kind: "numberList",
  },
  {
    id: "invoiceAmountsMinor",
    label: "Invoice amounts minor",
    kind: "numberList",
  },
  {
    id: "callerInclusiveUpperDayEdges",
    label: "Caller inclusive upper day edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.invoiceAmountsMinor.forEach((v) => money(v, "invoiceAmountsMinor"));
  aligned(
    input.invoiceDaysPastDue,
    input.invoiceAmountsMinor,
    "invoiceDaysPastDue",
  );
  const indices = ageBuckets(
      input.invoiceDaysPastDue,
      input.callerInclusiveUpperDayEdges,
    ),
    totals = Array<number>(input.callerInclusiveUpperDayEdges.length + 1).fill(
      0,
    );
  indices.forEach(
    (v, i) =>
      (totals[v] = money(
        totals[v] + input.invoiceAmountsMinor[i],
        "bucketTotal",
      )),
  );
  return { invoiceBucketIndices: indices, amountTotalsByBucketMinor: totals };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  invoiceDaysPastDue: [-5, 0, 30, 31, 90],
  invoiceAmountsMinor: [10, 20, 30, 40, 50],
  callerInclusiveUpperDayEdges: [0, 30, 60],
} satisfies Input;
export const exampleOutput = {
  invoiceBucketIndices: [0, 0, 1, 2, 3],
  amountTotalsByBucketMinor: [30, 30, 40, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/ar-aging-bucket-classifier",
  title: "AR Aging Bucket Classifier",
  description:
    "Bucket actual receivables by caller increasing inclusive upper day edges, retaining negative days for not-yet-due invoices; no hardcoded aging labels, collectibility assumptions or overdue-date extraction.",
  inputs: inputFields,
  outputs: [
    {
      id: "invoiceBucketIndices",
      label: "Invoice bucket indices",
      kind: "numberList",
    },
    {
      id: "amountTotalsByBucketMinor",
      label: "Amount totals by bucket minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      invoiceDaysPastDue: value.invoiceDaysPastDue as readonly number[],
      invoiceAmountsMinor: value.invoiceAmountsMinor as readonly number[],
      callerInclusiveUpperDayEdges:
        value.callerInclusiveUpperDayEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

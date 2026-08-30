import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly duplicationRequestedPageCounts: readonly number[];
  readonly waivedPageCounts: readonly number[];
  readonly callerRatePerBillablePage: readonly number[];
  readonly fixedOrderFee: number;
}>;
export type Output = Readonly<{
  readonly billablePageCounts: readonly number[];
  readonly lineDuplicationCharges: readonly number[];
  readonly totalDuplicationOrderCharge: number;
}>;
const inputFields = [
  {
    id: "duplicationRequestedPageCounts",
    label: "Duplication requested page counts",
    kind: "numberList",
  },
  { id: "waivedPageCounts", label: "Waived page counts", kind: "numberList" },
  {
    id: "callerRatePerBillablePage",
    label: "Caller rate per billable page",
    kind: "numberList",
  },
  { id: "fixedOrderFee", label: "Fixed order fee", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerRatePerBillablePage.forEach((v) =>
    nonnegative(v, "callerRatePerBillablePage"),
  );
  nonnegative(input.fixedOrderFee, "fixedOrderFee");
  input.duplicationRequestedPageCounts.forEach((v) =>
    count(v, "duplicationRequestedPageCounts"),
  );
  input.waivedPageCounts.forEach((v) => count(v, "waivedPageCounts"));
  aligned(
    input.duplicationRequestedPageCounts,
    input.waivedPageCounts,
    "duplicationRequestedPageCounts",
  );
  aligned(
    input.duplicationRequestedPageCounts,
    input.callerRatePerBillablePage,
    "duplicationRequestedPageCounts",
  );
  const n = input.duplicationRequestedPageCounts.map((v, i) =>
      count(v - input.waivedPageCounts[i], "billablePages"),
    ),
    charges = n.map((v, i) => v * input.callerRatePerBillablePage[i]);
  return {
    billablePageCounts: n,
    lineDuplicationCharges: charges,
    totalDuplicationOrderCharge: sum(charges) + input.fixedOrderFee,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  duplicationRequestedPageCounts: [10, 20],
  waivedPageCounts: [2, 0],
  callerRatePerBillablePage: [0.5, 1],
  fixedOrderFee: 5,
} satisfies Input;
export const exampleOutput = {
  billablePageCounts: [8, 20],
  lineDuplicationCharges: [4, 20],
  totalDuplicationOrderCharge: 29,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/duplication-page-cost-calculator",
  title: "Duplication Order Page Count Cost Calculator",
  description:
    "Budget heterogeneous page-order charges with separately declared waived pages/rates/fixed fee; no copying permission, rights clearance or universal repository pricing.",
  inputs: inputFields,
  outputs: [
    {
      id: "billablePageCounts",
      label: "Billable page counts",
      kind: "numberList",
    },
    {
      id: "lineDuplicationCharges",
      label: "Line duplication charges",
      kind: "numberList",
    },
    {
      id: "totalDuplicationOrderCharge",
      label: "Total duplication order charge",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      duplicationRequestedPageCounts:
        value.duplicationRequestedPageCounts as readonly number[],
      waivedPageCounts: value.waivedPageCounts as readonly number[],
      callerRatePerBillablePage:
        value.callerRatePerBillablePage as readonly number[],
      fixedOrderFee: value.fixedOrderFee as number,
    }),
});
export const run = tool.execute;
export default tool;

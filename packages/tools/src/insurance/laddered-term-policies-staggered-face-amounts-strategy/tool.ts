import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  unique,
  money,
  sumMoney,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly policyIds: readonly string[];
  readonly verifiedFaceAmountsMinor: readonly number[];
  readonly verifiedStartDays: readonly number[];
  readonly verifiedEndDaysExclusive: readonly number[];
  readonly queryDays: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "policyIds", label: "Policy ids", kind: "stringList" },
  {
    id: "verifiedFaceAmountsMinor",
    label: "Verified face amounts minor",
    kind: "numberList",
  },
  { id: "verifiedStartDays", label: "Verified start days", kind: "numberList" },
  {
    id: "verifiedEndDaysExclusive",
    label: "Verified end days exclusive",
    kind: "numberList",
  },
  { id: "queryDays", label: "Query days", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.policyIds, "policies");
  for (const v of [
    input.verifiedFaceAmountsMinor,
    input.verifiedStartDays,
    input.verifiedEndDaysExclusive,
  ])
    aligned(input.policyIds, v, "policies");
  input.verifiedFaceAmountsMinor.forEach((v) => money(v, "face"));
  input.verifiedStartDays.forEach((v, i) => {
    bounded(v, "start", 0, 1000000000);
    bounded(input.verifiedEndDaysExclusive[i], "end", v + 1, 1000000000);
  });
  input.queryDays.forEach((v) => bounded(v, "query", 0, 1000000000));
  return {
    activeFaceAmountByQueryMinor: input.queryDays.map((t) =>
      sumMoney(
        input.verifiedFaceAmountsMinor.map((v, i) =>
          t >= input.verifiedStartDays[i] &&
          t < input.verifiedEndDaysExclusive[i]
            ? v
            : 0,
        ),
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
    policyIds: ["a", "b", "c"],
    verifiedFaceAmountsMinor: [10000, 20000, 30000],
    verifiedStartDays: [0, 10, 0],
    verifiedEndDaysExclusive: [20, 30, 10],
    queryDays: [0, 10, 20, 30],
  },
  output: {
    result: { activeFaceAmountByQueryMinor: [40000, 30000, 20000, 0] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/laddered-term-policies-staggered-face-amounts-strategy",
  title: "Laddered Term Policies Staggered Face Amounts Strategy",
  description:
    "Aggregate actual staggered term-policy face amounts over independently verified half-open coverage intervals on one declared day scale. Exact minor units, overlaps retained; no insured-event determination, renewal inference or optimal-ladder recommendation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

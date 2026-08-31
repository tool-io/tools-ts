import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  aligned,
  bandIndices,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly revolvingReportedBalancesMinor: readonly number[];
  readonly revolvingCreditLimitsMinor: readonly number[];
  readonly callerInclusiveUtilizationPercentEdges: readonly number[];
}>;
export type Output = Readonly<{
  readonly perAccountUtilizationPercents: readonly number[];
  readonly aggregateReportedUtilizationPercent: number;
  readonly callerUtilizationBandIndices: readonly number[];
  readonly aggregateCallerUtilizationBandIndex: number;
  readonly overLimitAccountIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "revolvingReportedBalancesMinor",
    label: "Revolving reported balances minor",
    kind: "numberList",
  },
  {
    id: "revolvingCreditLimitsMinor",
    label: "Revolving credit limits minor",
    kind: "numberList",
  },
  {
    id: "callerInclusiveUtilizationPercentEdges",
    label: "Caller inclusive utilization percent edges",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.revolvingReportedBalancesMinor.forEach((v) =>
    money(v, "revolvingReportedBalancesMinor"),
  );
  input.revolvingCreditLimitsMinor.forEach((v) =>
    money(v, "revolvingCreditLimitsMinor"),
  );
  aligned(
    input.revolvingReportedBalancesMinor,
    input.revolvingCreditLimitsMinor,
    "revolvingReportedBalancesMinor",
  );
  input.revolvingCreditLimitsMinor.forEach((v) => positive(v, "limit"));
  const rates = input.revolvingReportedBalancesMinor.map(
      (v, i) => (100 * v) / input.revolvingCreditLimitsMinor[i],
    ),
    aggregate =
      (100 * sumMoney(input.revolvingReportedBalancesMinor)) /
      sumMoney(input.revolvingCreditLimitsMinor);
  return {
    perAccountUtilizationPercents: rates,
    aggregateReportedUtilizationPercent: aggregate,
    callerUtilizationBandIndices: bandIndices(
      rates,
      input.callerInclusiveUtilizationPercentEdges,
    ),
    aggregateCallerUtilizationBandIndex: bandIndices(
      [aggregate],
      input.callerInclusiveUtilizationPercentEdges,
    )[0],
    overLimitAccountIndices: input.revolvingReportedBalancesMinor.flatMap(
      (v, i) => (v > input.revolvingCreditLimitsMinor[i] ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  revolvingReportedBalancesMinor: [50, 90],
  revolvingCreditLimitsMinor: [100, 100],
  callerInclusiveUtilizationPercentEdges: [30, 70],
} satisfies Input;
export const exampleOutput = {
  perAccountUtilizationPercents: [50, 90],
  aggregateReportedUtilizationPercent: 70,
  callerUtilizationBandIndices: [1, 2],
  aggregateCallerUtilizationBandIndex: 1,
  overLimitAccountIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/credit-utilization-tier-impact-lookup",
  title: "Credit Utilization Tier Impact Lookup",
  description:
    "Audit actual per-account and pooled reported revolving utilization against caller bands, preserving over-limit evidence; no predicted credit-score points, official impact tiers or optimization advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "perAccountUtilizationPercents",
      label: "Per account utilization percents",
      kind: "numberList",
    },
    {
      id: "aggregateReportedUtilizationPercent",
      label: "Aggregate reported utilization percent",
      kind: "number",
    },
    {
      id: "callerUtilizationBandIndices",
      label: "Caller utilization band indices",
      kind: "numberList",
    },
    {
      id: "aggregateCallerUtilizationBandIndex",
      label: "Aggregate caller utilization band index",
      kind: "number",
    },
    {
      id: "overLimitAccountIndices",
      label: "Over limit account indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      revolvingReportedBalancesMinor:
        value.revolvingReportedBalancesMinor as readonly number[],
      revolvingCreditLimitsMinor:
        value.revolvingCreditLimitsMinor as readonly number[],
      callerInclusiveUtilizationPercentEdges:
        value.callerInclusiveUtilizationPercentEdges as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

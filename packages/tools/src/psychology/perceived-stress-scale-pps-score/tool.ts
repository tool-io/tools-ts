import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, callerInstrument } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly actualInstrumentItemIds: readonly string[];
  readonly actualIndependentlyEstablishedItemScores: readonly number[];
  readonly callerVerifiedItemMinima: readonly number[];
  readonly callerVerifiedItemMaxima: readonly number[];
  readonly callerVerifiedReverseKeyFlags: readonly number[];
  readonly callerVerifiedItemWeights: readonly number[];
  readonly itemEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSource",
    label: "Caller verified source",
    kind: "string",
  },
  {
    id: "callerVerifiedContext",
    label: "Caller verified context",
    kind: "string",
  },
  {
    id: "callerVerifiedAsOfDate",
    label: "Caller verified as of date",
    kind: "string",
  },
  {
    id: "actualInstrumentItemIds",
    label: "Actual instrument item ids",
    kind: "stringList",
  },
  {
    id: "actualIndependentlyEstablishedItemScores",
    label: "Actual independently established item scores",
    kind: "numberList",
  },
  {
    id: "callerVerifiedItemMinima",
    label: "Caller verified item minima",
    kind: "numberList",
  },
  {
    id: "callerVerifiedItemMaxima",
    label: "Caller verified item maxima",
    kind: "numberList",
  },
  {
    id: "callerVerifiedReverseKeyFlags",
    label: "Caller verified reverse key flags",
    kind: "numberList",
  },
  {
    id: "callerVerifiedItemWeights",
    label: "Caller verified item weights",
    kind: "numberList",
  },
  {
    id: "itemEvidenceKnownFlags",
    label: "Item evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return callerInstrument(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
    input.actualInstrumentItemIds,
    input.actualIndependentlyEstablishedItemScores,
    input.callerVerifiedItemMinima,
    input.callerVerifiedItemMaxima,
    input.callerVerifiedReverseKeyFlags,
    input.callerVerifiedItemWeights,
    input.itemEvidenceKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-instrument/edition",
    callerVerifiedContext:
      "Actual separately validated Perceived Stress Scale Score Calculator key, administration and missing-item policy; no published/proprietary item wording reproduced",
    callerVerifiedAsOfDate: "2026-01-01",
    actualInstrumentItemIds: ["a", "b"],
    actualIndependentlyEstablishedItemScores: [1, 3],
    callerVerifiedItemMinima: [0, 0],
    callerVerifiedItemMaxima: [4, 4],
    callerVerifiedReverseKeyFlags: [0, 1],
    callerVerifiedItemWeights: [1, 1],
    itemEvidenceKnownFlags: [1, 1],
  },
  output: {
    result: {
      knownWeightedItemSum: 2,
      minimumPossibleWeightedTotal: 2,
      maximumPossibleWeightedTotal: 2,
      unknownItemIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/perceived-stress-scale-pps-score",
  title: "Perceived Stress Scale Score Calculator",
  description:
    "Qualified caller-instrument aggregation for Perceived Stress Scale Score Calculator. Actual separately validated Perceived Stress Scale Score Calculator key, administration and missing-item policy; no published/proprietary item wording reproduced. Actual verified edition/item bounds/reverse keys/weights required, examples not the published key. Unknown items retain possible-total bounds; no licensed questionnaire reproduced, automatic scoring-key inference, norm, diagnosis, clinical cutoff or validated prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

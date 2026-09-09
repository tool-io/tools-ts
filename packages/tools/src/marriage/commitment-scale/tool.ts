import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, callerInstrument } from "../batch48-shared.js";
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
      "Actual independently verified Commitment Scale Calculator instrument edition, item identities/ranges, reverse keys, weights, subscale and qualified administration; examples are illustrative custom item codes, not the published instrument key",
    callerVerifiedAsOfDate: "2026-01-01",
    actualInstrumentItemIds: ["item-a", "item-b"],
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
  id: "marriage/commitment-scale",
  title: "Commitment Scale Calculator",
  description:
    "Qualified caller-instrument item aggregation for Commitment Scale Calculator. Actual independently verified Commitment Scale Calculator instrument edition, item identities/ranges, reverse keys, weights, subscale and qualified administration; examples are illustrative custom item codes, not the published instrument key. Exact reverse scoring min+max\u2212score and independent weights; unknown item bounds retained. No embedded proprietary instrument, automatic norm/diagnosis, asset protection probability, partner evaluation, clinical cutoff or validated prediction. Library verifies only supplied structure/arithmetic, not authenticity of caller keys.",
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

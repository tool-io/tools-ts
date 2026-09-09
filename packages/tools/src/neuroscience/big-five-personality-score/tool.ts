import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  bounded,
  mean,
  ownReference,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly independentlyRecordedItemScores: readonly number[];
  readonly callerVerifiedFactorIndices: readonly number[];
  readonly callerVerifiedReverseFlags: readonly number[];
  readonly itemKnownFlags: readonly number[];
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
    id: "independentlyRecordedItemScores",
    label: "Independently recorded item scores",
    kind: "numberList",
  },
  {
    id: "callerVerifiedFactorIndices",
    label: "Caller verified factor indices",
    kind: "numberList",
  },
  {
    id: "callerVerifiedReverseFlags",
    label: "Caller verified reverse flags",
    kind: "numberList",
  },
  { id: "itemKnownFlags", label: "Item known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  const x = input.independentlyRecordedItemScores;
  for (const v of [
    input.callerVerifiedFactorIndices,
    input.callerVerifiedReverseFlags,
    input.itemKnownFlags,
  ])
    aligned(x, v, "items");
  binary(input.callerVerifiedReverseFlags, "reverse");
  binary(input.itemKnownFlags, "known");
  x.forEach((v) => bounded(v, "score", 1, 5));
  input.callerVerifiedFactorIndices.forEach((v) => bounded(v, "factor", 0, 4));
  if (
    [0, 1, 2, 3, 4].some((f) => !input.callerVerifiedFactorIndices.includes(f))
  )
    simpleError(
      "factors",
      "Each actual instrument factor must be represented.",
    );
  const means: number[] = [],
    available: number[] = [];
  for (let f = 0; f < 5; f++) {
    const values = x.flatMap((v, i) =>
      input.itemKnownFlags[i] && input.callerVerifiedFactorIndices[i] === f
        ? [input.callerVerifiedReverseFlags[i] ? 6 - v : v]
        : [],
    );
    available.push(values.length ? 1 : 0);
    means.push(values.length ? mean(values) : 0);
  }
  return {
    knownFactorMeans: means,
    knownFactorMeanAvailableFlags: available,
    unknownItemIndices: input.itemKnownFlags.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "verified-instrument/edition",
    callerVerifiedContext:
      "actual factor/reverse key and response-scale direction independently verified",
    callerVerifiedAsOfDate: "2026-01-01",
    independentlyRecordedItemScores: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    callerVerifiedFactorIndices: [0, 1, 2, 3, 4, 0, 1, 2, 3, 4],
    callerVerifiedReverseFlags: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    itemKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownFactorMeans: [1, 2, 3, 4, 5],
      knownFactorMeanAvailableFlags: [1, 1, 1, 1, 1],
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/big-five-personality-score",
  title: "Big Five Personality Score Calculator",
  description:
    "Actual five-factor instrument score aggregation under independently verified item-factor and reversal key on declared1\u20135response scale. Factor indices in caller declared order; missing factor mean has0placeholder with availability flag0, not an inferred trait. Not a universal BigFiveinventory, diagnosis or prediction of behavior; illustrative key is not validated.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

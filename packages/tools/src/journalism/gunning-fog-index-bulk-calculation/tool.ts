import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
  aligned,
  sum,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedDocumentWords: readonly number[];
  readonly observedDocumentSentenceCounts: readonly number[];
  readonly independentlyFogEligibleComplexWordCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledGunningFogIndex: number;
  readonly individualDocumentFogIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDocumentWords",
    label: "Observed document words",
    kind: "numberList",
  },
  {
    id: "observedDocumentSentenceCounts",
    label: "Observed document sentence counts",
    kind: "numberList",
  },
  {
    id: "independentlyFogEligibleComplexWordCounts",
    label: "Independently fog eligible complex word counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDocumentWords.forEach((v) =>
    positive(v, "observedDocumentWords"),
  );
  input.observedDocumentSentenceCounts.forEach((v) =>
    positive(v, "observedDocumentSentenceCounts"),
  );
  input.independentlyFogEligibleComplexWordCounts.forEach((v) =>
    nonnegative(v, "independentlyFogEligibleComplexWordCounts"),
  );
  aligned(
    input.observedDocumentWords,
    input.observedDocumentSentenceCounts,
    "observedDocumentWords",
  );
  aligned(
    input.observedDocumentWords,
    input.independentlyFogEligibleComplexWordCounts,
    "observedDocumentWords",
  );
  [
    ...input.observedDocumentWords,
    ...input.observedDocumentSentenceCounts,
    ...input.independentlyFogEligibleComplexWordCounts,
  ].forEach((v) => integer(v, "counts"));
  input.observedDocumentWords.forEach((v, i) => {
    if (
      input.independentlyFogEligibleComplexWordCounts[i] > v ||
      input.observedDocumentSentenceCounts[i] > v
    )
      simpleError("counts", "Sentences and eligible complex words≤words.");
  });
  const w = sum(input.observedDocumentWords),
    s = sum(input.observedDocumentSentenceCounts),
    c = sum(input.independentlyFogEligibleComplexWordCounts);
  return {
    pooledGunningFogIndex: 0.4 * (w / s + (100 * c) / w),
    individualDocumentFogIndices: input.observedDocumentWords.map(
      (v, i) =>
        0.4 *
        (v / input.observedDocumentSentenceCounts[i] +
          (100 * input.independentlyFogEligibleComplexWordCounts[i]) / v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDocumentWords: [100, 200],
  observedDocumentSentenceCounts: [5, 10],
  independentlyFogEligibleComplexWordCounts: [10, 20],
} satisfies Input;
export const exampleOutput = {
  pooledGunningFogIndex: 12,
  individualDocumentFogIndices: [12, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/gunning-fog-index-bulk-calculation",
  title: "Gunning Fog Index Bulk Calculation",
  description:
    "Bulk exposure-pooled Fog 0.4(words/sentences+100 eligible complex/words); caller independently applies syllable/proper-name/suffix exclusions, not average document indices or comprehension guarantee. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledGunningFogIndex",
      label: "Pooled gunning fog index",
      kind: "number",
    },
    {
      id: "individualDocumentFogIndices",
      label: "Individual document fog indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDocumentWords: value.observedDocumentWords as readonly number[],
      observedDocumentSentenceCounts:
        value.observedDocumentSentenceCounts as readonly number[],
      independentlyFogEligibleComplexWordCounts:
        value.independentlyFogEligibleComplexWordCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

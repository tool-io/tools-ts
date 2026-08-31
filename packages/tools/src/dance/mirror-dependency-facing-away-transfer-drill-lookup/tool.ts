import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly matchedPhraseIds: readonly string[];
  readonly observedMirrorErrors: readonly number[];
  readonly observedFacingAwayErrors: readonly number[];
  readonly callerMaximumExtraFacingAwayErrors: number;
}>;
export type Output = Readonly<{
  readonly facingAwayMinusMirrorErrorsByPhrase: readonly number[];
  readonly phrasesAboveCallerTransferGap: readonly string[];
  readonly totalMatchedExtraFacingAwayErrors: number;
}>;
const inputFields = [
  { id: "matchedPhraseIds", label: "Matched phrase ids", kind: "stringList" },
  {
    id: "observedMirrorErrors",
    label: "Observed mirror errors",
    kind: "numberList",
  },
  {
    id: "observedFacingAwayErrors",
    label: "Observed facing away errors",
    kind: "numberList",
  },
  {
    id: "callerMaximumExtraFacingAwayErrors",
    label: "Caller maximum extra facing away errors",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.matchedPhraseIds, "phrases");
  aligned(input.matchedPhraseIds, input.observedMirrorErrors, "mirror");
  aligned(input.matchedPhraseIds, input.observedFacingAwayErrors, "away");
  [
    ...input.observedMirrorErrors,
    ...input.observedFacingAwayErrors,
    input.callerMaximumExtraFacingAwayErrors,
  ].forEach((v) => bounded(v, "errors", 0, 1000000));
  const d = input.observedFacingAwayErrors.map(
    (v, i) => v - input.observedMirrorErrors[i],
  );
  return {
    facingAwayMinusMirrorErrorsByPhrase: d,
    phrasesAboveCallerTransferGap: input.matchedPhraseIds.filter(
      (_, i) => d[i] > input.callerMaximumExtraFacingAwayErrors,
    ),
    totalMatchedExtraFacingAwayErrors: sum(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  matchedPhraseIds: ["A", "B"],
  observedMirrorErrors: [0, 1],
  observedFacingAwayErrors: [2, 1],
  callerMaximumExtraFacingAwayErrors: 1,
} satisfies Input;
export const exampleOutput = {
  facingAwayMinusMirrorErrorsByPhrase: [2, 0],
  phrasesAboveCallerTransferGap: ["A"],
  totalMatchedExtraFacingAwayErrors: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/mirror-dependency-facing-away-transfer-drill-lookup",
  title: "Mirror Dependency Facing Away Transfer Drill Lookup",
  description:
    "Audit actual matched mirror/facing-away phrase error evidence with signed transfer differences; not diagnosis of mirror dependency, causal attribution or prescribed training drill.",
  inputs: inputFields,
  outputs: [
    {
      id: "facingAwayMinusMirrorErrorsByPhrase",
      label: "Facing away minus mirror errors by phrase",
      kind: "numberList",
    },
    {
      id: "phrasesAboveCallerTransferGap",
      label: "Phrases above caller transfer gap",
      kind: "stringList",
    },
    {
      id: "totalMatchedExtraFacingAwayErrors",
      label: "Total matched extra facing away errors",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      matchedPhraseIds: value.matchedPhraseIds as readonly string[],
      observedMirrorErrors: value.observedMirrorErrors as readonly number[],
      observedFacingAwayErrors:
        value.observedFacingAwayErrors as readonly number[],
      callerMaximumExtraFacingAwayErrors:
        value.callerMaximumExtraFacingAwayErrors as number,
    }),
});
export const run = tool.execute;
export default tool;

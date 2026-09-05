import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerSameYearDefinitionLanguageIds: readonly string[];
  readonly callerMatchedSpeakerCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly competitionRanks: readonly number[];
  readonly withinTopTwentyFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "callerSameYearDefinitionLanguageIds",
    label: "Caller same year definition language ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedSpeakerCounts",
    label: "Caller matched speaker counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedSpeakerCounts.forEach((v) =>
    nonnegative(v, "callerMatchedSpeakerCounts"),
  );
  aligned(
    input.callerSameYearDefinitionLanguageIds,
    input.callerMatchedSpeakerCounts,
    "callerSameYearDefinitionLanguageIds",
  );
  unique(input.callerSameYearDefinitionLanguageIds, "language definitions");
  const sorted = [...input.callerMatchedSpeakerCounts].sort((a, b) => b - a),
    rank = input.callerMatchedSpeakerCounts.map((v) => sorted.indexOf(v) + 1);
  return {
    competitionRanks: rank,
    withinTopTwentyFlags: rank.map((v) => (v <= 20 ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSameYearDefinitionLanguageIds: ["a", "b", "c"],
  callerMatchedSpeakerCounts: [100, 50, 50],
} satisfies Input;
export const exampleOutput = {
  competitionRanks: [1, 2, 2],
  withinTopTwentyFlags: [1, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/most-spoken-languages-top20-rank",
  title: "Most-Spoken Languages Top-20 Rank Lookup",
  description:
    "Rank independently same-year/definition speaker evidence with competition ties and top20membership; caller population/variety grouping completeness required, no live ranking. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    { id: "competitionRanks", label: "Competition ranks", kind: "numberList" },
    {
      id: "withinTopTwentyFlags",
      label: "Within top twenty flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSameYearDefinitionLanguageIds:
        value.callerSameYearDefinitionLanguageIds as readonly string[],
      callerMatchedSpeakerCounts:
        value.callerMatchedSpeakerCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  totalCount,
  bounded,
  lexemes,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly weightedLexemeCounts: readonly number[];
  readonly callerOriginCodesOtherLatinUnknown: readonly number[];
}>;
export type Output = Readonly<{
  readonly latinShareAmongClassifiedPercent: number;
  readonly latinShareOfAllObservedWeightPercent: number;
  readonly unknownOriginWeightPercent: number;
  readonly classifiedEvidenceAvailable: boolean;
}>;
const inputFields = [
  {
    id: "weightedLexemeCounts",
    label: "Weighted lexeme counts",
    kind: "numberList",
  },
  {
    id: "callerOriginCodesOtherLatinUnknown",
    label: "Caller origin codes other latin unknown",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.weightedLexemeCounts.forEach((v) => count(v, "weightedLexemeCounts"));
  aligned(
    input.weightedLexemeCounts,
    input.callerOriginCodesOtherLatinUnknown,
    "weightedLexemeCounts",
  );
  input.callerOriginCodesOtherLatinUnknown.forEach((v) =>
    bounded(v, "origin", 0, 2),
  );
  const total = positive(
      totalCount(input.weightedLexemeCounts, "lexemes"),
      "observedWeight",
    ),
    latin = input.weightedLexemeCounts.reduce(
      (s, v, i) =>
        s + (input.callerOriginCodesOtherLatinUnknown[i] === 1 ? v : 0),
      0,
    ),
    unknown = input.weightedLexemeCounts.reduce(
      (s, v, i) =>
        s + (input.callerOriginCodesOtherLatinUnknown[i] === 2 ? v : 0),
      0,
    ),
    known = total - unknown;
  return {
    latinShareAmongClassifiedPercent: known ? (100 * latin) / known : -1,
    latinShareOfAllObservedWeightPercent: (100 * latin) / total,
    unknownOriginWeightPercent: (100 * unknown) / total,
    classifiedEvidenceAvailable: known > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  weightedLexemeCounts: [2, 1, 1],
  callerOriginCodesOtherLatinUnknown: [1, 0, 2],
} satisfies Input;
export const exampleOutput = {
  latinShareAmongClassifiedPercent: 66.66666666666667,
  latinShareOfAllObservedWeightPercent: 50,
  unknownOriginWeightPercent: 25,
  classifiedEvidenceAvailable: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/romance-latin-root-percent-estimate",
  title: "Romance Latin Root Percent Estimate",
  description:
    "Audit Latin-origin share of caller classified lexeme inventory, separately exposing unknown weight and conditional versus all-observation denominators; no embedded language-wide ancestry percentages or verified etymology.",
  inputs: inputFields,
  outputs: [
    {
      id: "latinShareAmongClassifiedPercent",
      label: "Latin share among classified percent",
      kind: "number",
    },
    {
      id: "latinShareOfAllObservedWeightPercent",
      label: "Latin share of all observed weight percent",
      kind: "number",
    },
    {
      id: "unknownOriginWeightPercent",
      label: "Unknown origin weight percent",
      kind: "number",
    },
    {
      id: "classifiedEvidenceAvailable",
      label: "Classified evidence available",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      weightedLexemeCounts: value.weightedLexemeCounts as readonly number[],
      callerOriginCodesOtherLatinUnknown:
        value.callerOriginCodesOtherLatinUnknown as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

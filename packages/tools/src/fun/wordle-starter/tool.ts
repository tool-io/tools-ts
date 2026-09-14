import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
  unique,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly callerCandidateStartWords: readonly string[];
  readonly callerMatchedLetterWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCandidateStartWords",
    label: "Caller candidate start words",
    kind: "stringList",
  },
  {
    id: "callerMatchedLetterWeights",
    label: "Caller matched letter weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (input.callerMatchedLetterWeights.length !== 26)
    simpleError("weights", "Actual26letterweights.");
  input.callerMatchedLetterWeights.forEach((v) => nonnegative(v, "weight"));
  unique(input.callerCandidateStartWords, "candidates");
  if (input.callerCandidateStartWords.some((v) => !/^[a-z]{5}$/.test(v)))
    simpleError("word", "Five lowercaseletters.");
  const a = input.callerCandidateStartWords.map((v) =>
      sum(
        [...new Set(v)].map(
          (c) => input.callerMatchedLetterWeights[c.charCodeAt(0) - 97],
        ),
      ),
    ),
    m = Math.max(...a);
  return {
    tiedTopCandidates: input.callerCandidateStartWords.filter(
      (_, i) => a[i] === m,
    ),
    maximumUniqueLetterWeight: m,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    callerCandidateStartWords: ["crane", "slate"],
    callerMatchedLetterWeights: [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1,
    ],
  },
  output: {
    result: {
      tiedTopCandidates: ["crane", "slate"],
      maximumUniqueLetterWeight: 5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/wordle-starter",
  title: "Wordle Starting Word Advisor",
  description:
    "ExplicitcallerletterweightWordle-starterheuristic,tiesretained,not informationentropyoptimality or hiddenofficialdictionary. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

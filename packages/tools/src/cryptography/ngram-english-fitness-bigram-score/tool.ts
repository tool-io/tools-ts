import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  letters,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerBigrams: readonly string[];
  readonly callerLogProbabilities: readonly number[];
  readonly callerUnknownLogProbability: number;
}>;
export type Output = Readonly<{
  readonly totalBigramLogFitness: number;
  readonly scoredBigramCount: number;
  readonly unknownBigramCount: number;
}>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "callerBigrams", label: "Caller bigrams", kind: "stringList" },
  {
    id: "callerLogProbabilities",
    label: "Caller log probabilities",
    kind: "numberList",
  },
  {
    id: "callerUnknownLogProbability",
    label: "Caller unknown log probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  unique(input.callerBigrams, "bigrams");
  aligned(input.callerBigrams, input.callerLogProbabilities, "corpus");
  if (
    input.callerBigrams.some((v) => !/^[A-Z]{2}$(?![\s\S])/.test(v)) ||
    input.callerLogProbabilities.some((v) => v > 0) ||
    input.callerUnknownLogProbability > 0
  )
    simpleError(
      "corpus",
      "Canonical uppercase bigrams and nonpositive caller log probabilities required.",
    );
  let total = 0,
    unknown = 0;
  for (let i = 0; i < input.text.length - 1; i++) {
    const n = input.callerBigrams.indexOf(input.text.slice(i, i + 2));
    if (n < 0) unknown++;
    total +=
      n < 0
        ? input.callerUnknownLogProbability
        : input.callerLogProbabilities[n];
  }
  return {
    totalBigramLogFitness: total,
    scoredBigramCount: Math.max(0, input.text.length - 1),
    unknownBigramCount: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABAB",
  callerBigrams: ["AB", "BA"],
  callerLogProbabilities: [-1, -2],
  callerUnknownLogProbability: -5,
} satisfies Input;
export const exampleOutput = {
  totalBigramLogFitness: -4,
  scoredBigramCount: 3,
  unknownBigramCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/ngram-english-fitness-bigram-score",
  title: "Bigram English Fitness Score",
  description:
    "Score actual overlapping English bigrams against explicit independently supplied log corpus model/unknown penalty, no fabricated language corpus or decryption correctness.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalBigramLogFitness",
      label: "Total bigram log fitness",
      kind: "number",
    },
    { id: "scoredBigramCount", label: "Scored bigram count", kind: "number" },
    { id: "unknownBigramCount", label: "Unknown bigram count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerBigrams: value.callerBigrams as readonly string[],
      callerLogProbabilities: value.callerLogProbabilities as readonly number[],
      callerUnknownLogProbability: value.callerUnknownLogProbability as number,
    }),
});
export const run = tool.execute;
export default tool;

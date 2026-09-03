import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, letters } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly ngramLength: number;
  readonly maxCandidatePeriod: number;
}>;
export type Output = Readonly<{
  readonly repeatedNgramDistances: readonly number[];
  readonly candidatePeriods: readonly number[];
  readonly distanceDivisibilityVotes: readonly number[];
}>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "ngramLength", label: "Ngram length", kind: "number" },
  { id: "maxCandidatePeriod", label: "Max candidate period", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  if (input.text.length > 512)
    simpleError("text", "Kasiski bounded512-character evidence required.");
  bounded(input.ngramLength, "ngram", 2, 8);
  bounded(input.maxCandidatePeriod, "period", 2, 128);
  const positions = new Map<string, number[]>();
  for (let i = 0; i <= input.text.length - input.ngramLength; i++) {
    const g = input.text.slice(i, i + input.ngramLength);
    positions.set(g, [...(positions.get(g) ?? []), i]);
  }
  const distances: number[] = [];
  for (const v of positions.values())
    for (let i = 0; i < v.length; i++)
      for (let j = i + 1; j < v.length; j++) {
        if (distances.length >= 10000)
          simpleError(
            "distances",
            "At most10000 repeated ngram position pairs.",
          );
        distances.push(v[j] - v[i]);
      }
  const candidates = Array.from(
    { length: input.maxCandidatePeriod - 1 },
    (_, i) => i + 2,
  );
  return {
    repeatedNgramDistances: distances,
    candidatePeriods: candidates,
    distanceDivisibilityVotes: candidates.map(
      (p) => distances.filter((d) => d % p === 0).length,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABCABCABC",
  ngramLength: 3,
  maxCandidatePeriod: 6,
} satisfies Input;
export const exampleOutput = {
  repeatedNgramDistances: [3, 6, 3, 3, 3],
  candidatePeriods: [2, 3, 4, 5, 6],
  distanceDivisibilityVotes: [1, 5, 0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/kasiski-examination-period-guess",
  title: "Kasiski Examination Period Guesser",
  description:
    "Count actual repeated-ngram position-pair distances and divisor votes, overlapping ngrams explicit; candidates not a recovered key length. Classical educational encoding only; not secure encryption, no hidden normalization or inferred key.",
  inputs: inputFields,
  outputs: [
    {
      id: "repeatedNgramDistances",
      label: "Repeated ngram distances",
      kind: "numberList",
    },
    { id: "candidatePeriods", label: "Candidate periods", kind: "numberList" },
    {
      id: "distanceDivisibilityVotes",
      label: "Distance divisibility votes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      ngramLength: value.ngramLength as number,
      maxCandidatePeriod: value.maxCandidatePeriod as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, textBound } from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedText: string;
  readonly callerAlphabetLetters: readonly string[];
}>;
export type Output = Readonly<{
  readonly alphabetLetterCounts: readonly number[];
  readonly competitionFrequencyRanks: readonly number[];
  readonly countedAlphabetLetters: number;
  readonly unlistedLetterCount: number;
}>;
const inputFields = [
  { id: "observedText", label: "Observed text", kind: "string" },
  {
    id: "callerAlphabetLetters",
    label: "Caller alphabet letters",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const alphabet = input.callerAlphabetLetters.map((s) =>
    s.normalize("NFC").toLowerCase(),
  );
  if (
    !alphabet.length ||
    new Set(alphabet).size !== alphabet.length ||
    alphabet.some((s) => [...s].length !== 1 || !/\p{L}/u.test(s))
  )
    simpleError(
      "alphabet",
      "Distinct explicit single-letter normalized alphabet entries required.",
    );
  const counts = Array<number>(alphabet.length).fill(0);
  let unlisted = 0;
  for (const c of textBound(input.observedText)
    .normalize("NFC")
    .toLowerCase()) {
    if (!/\p{L}/u.test(c)) continue;
    const i = alphabet.indexOf(c);
    if (i < 0) unlisted++;
    else counts[i]++;
  }
  return {
    alphabetLetterCounts: counts,
    competitionFrequencyRanks: counts.map(
      (v) => 1 + counts.filter((n) => n > v).length,
    ),
    countedAlphabetLetters: sum(counts),
    unlistedLetterCount: unlisted,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedText: "Aa b",
  callerAlphabetLetters: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  alphabetLetterCounts: [2, 1, 0],
  competitionFrequencyRanks: [1, 2, 3],
  countedAlphabetLetters: 3,
  unlistedLetterCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/letter-frequency-rank-by-language-lookup",
  title: "Letter Frequency Rank By Language Lookup Table",
  description:
    "Rank actual corpus letters under caller single-letter alphabet with competition ties and unlisted evidence retained; not an embedded language frequency table, digraph segmentation or transliteration.",
  inputs: inputFields,
  outputs: [
    {
      id: "alphabetLetterCounts",
      label: "Alphabet letter counts",
      kind: "numberList",
    },
    {
      id: "competitionFrequencyRanks",
      label: "Competition frequency ranks",
      kind: "numberList",
    },
    {
      id: "countedAlphabetLetters",
      label: "Counted alphabet letters",
      kind: "number",
    },
    {
      id: "unlistedLetterCount",
      label: "Unlisted letter count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedText: value.observedText as string,
      callerAlphabetLetters: value.callerAlphabetLetters as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;

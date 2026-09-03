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
  aligned,
  sum,
  letters,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly callerAlphabet: string;
  readonly callerExpectedFrequencies: readonly number[];
}>;
export type Output = Readonly<{
  readonly pearsonLetterFitness: number;
  readonly observedCounts: readonly number[];
}>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "callerAlphabet", label: "Caller alphabet", kind: "string" },
  {
    id: "callerExpectedFrequencies",
    label: "Caller expected frequencies",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.callerAlphabet.length ||
    input.callerAlphabet.length > 26 ||
    new Set(input.callerAlphabet).size !== input.callerAlphabet.length ||
    !/^[A-Z]+$(?![\s\S])/.test(input.callerAlphabet)
  )
    simpleError(
      "alphabet",
      "Distinct explicit supported reference letters required.",
    );
  letters(input.text, input.callerAlphabet);
  aligned(
    [...input.callerAlphabet],
    input.callerExpectedFrequencies,
    "reference",
  );
  input.callerExpectedFrequencies.forEach((v) => positive(v, "frequency"));
  if (
    Math.abs(sum(input.callerExpectedFrequencies) - 1) > 1e-10 ||
    !input.text.length
  )
    simpleError(
      "reference",
      "Positive frequency model summing to1 and nonempty observations required.",
    );
  const counts = [...input.callerAlphabet].map(
    (c) => [...input.text].filter((x) => x === c).length,
  );
  return {
    pearsonLetterFitness: sum(
      counts.map(
        (v, i) =>
          (v - input.text.length * input.callerExpectedFrequencies[i]) ** 2 /
          (input.text.length * input.callerExpectedFrequencies[i]),
      ),
    ),
    observedCounts: counts,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "AABB",
  callerAlphabet: "AB",
  callerExpectedFrequencies: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  pearsonLetterFitness: 0,
  observedCounts: [2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/chi-squared-english-fitness-scorer",
  title: "Chi-Squared English Fitness Scorer",
  description:
    "Score actual letters against explicit independently supplied English frequency model, no hidden English corpus, chi-square significance or cipher identity inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "pearsonLetterFitness",
      label: "Pearson letter fitness",
      kind: "number",
    },
    { id: "observedCounts", label: "Observed counts", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      callerAlphabet: value.callerAlphabet as string,
      callerExpectedFrequencies:
        value.callerExpectedFrequencies as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

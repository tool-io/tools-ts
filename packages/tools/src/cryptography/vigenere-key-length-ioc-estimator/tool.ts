import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, letters } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly text: string;
  readonly maxCandidateKeyLength: number;
}>;
export type Output = Readonly<{
  readonly candidateKeyLengths: readonly number[];
  readonly pooledWithinColumnIoC: readonly number[];
  readonly eligibleOrderedPairCounts: readonly number[];
}>;
const inputFields = [
  { id: "text", label: "Text", kind: "string" },
  {
    id: "maxCandidateKeyLength",
    label: "Max candidate key length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  letters(input.text);
  bounded(input.maxCandidateKeyLength, "length", 1, 128);
  if (!input.text.length)
    simpleError("text", "Nonempty cipher evidence required.");
  const lengths = Array.from(
      { length: input.maxCandidateKeyLength },
      (_, i) => i + 1,
    ),
    pairs: number[] = [],
    scores: number[] = [];
  for (const period of lengths) {
    let matches = 0,
      eligible = 0;
    for (let c = 0; c < period; c++) {
      const col = [...input.text].filter((_, i) => i % period === c);
      eligible += col.length * (col.length - 1);
      for (const a of new Set(col)) {
        const n = col.filter((v) => v === a).length;
        matches += n * (n - 1);
      }
    }
    pairs.push(eligible);
    scores.push(eligible ? matches / eligible : -1);
  }
  return {
    candidateKeyLengths: lengths,
    pooledWithinColumnIoC: scores,
    eligibleOrderedPairCounts: pairs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  text: "ABAB",
  maxCandidateKeyLength: 2,
} satisfies Input;
export const exampleOutput = {
  candidateKeyLengths: [1, 2],
  pooledWithinColumnIoC: [0.3333333333333333, 1],
  eligibleOrderedPairCounts: [12, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/vigenere-key-length-ioc-estimator",
  title: "Vigenère Key-Length IoC Estimator",
  description:
    "Compute per-candidate-key-length pooled within-column IoC and explicit eligible-pair denominators; absent pairs sentinel−1, distinct from whole-text IoC and no recovered-key claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "candidateKeyLengths",
      label: "Candidate key lengths",
      kind: "numberList",
    },
    {
      id: "pooledWithinColumnIoC",
      label: "Pooled within column io c",
      kind: "numberList",
    },
    {
      id: "eligibleOrderedPairCounts",
      label: "Eligible ordered pair counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      text: value.text as string,
      maxCandidateKeyLength: value.maxCandidateKeyLength as number,
    }),
});
export const run = tool.execute;
export default tool;

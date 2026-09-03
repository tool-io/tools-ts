import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{ readonly plugboardPairs: readonly string[] }>;
export type Output = Readonly<{
  readonly usedLetters: string;
  readonly unpairedLetters: string;
  readonly pairCount: number;
}>;
const inputFields = [
  { id: "plugboardPairs", label: "Plugboard pairs", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.plugboardPairs.length > 13)
    simpleError("pairs", "At most13 disjoint Enigma plugboard pairs.");
  const all = input.plugboardPairs.join("");
  if (
    input.plugboardPairs.some(
      (p) => !/^[A-Z]{2}$(?![\s\S])/.test(p) || p[0] === p[1],
    ) ||
    new Set(all).size !== all.length
  )
    simpleError(
      "pairs",
      "Two distinct uppercase letters per pair, no repeated letter across pairs.",
    );
  return {
    usedLetters: [...all].sort().join(""),
    unpairedLetters: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
      .filter((c) => !all.includes(c))
      .join(""),
    pairCount: input.plugboardPairs.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { plugboardPairs: ["AB", "CD"] } satisfies Input;
export const exampleOutput = {
  usedLetters: "ABCD",
  unpairedLetters: "EFGHIJKLMNOPQRSTUVWXYZ",
  pairCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/enigma-plugboard-pairing-count-checker",
  title: "Enigma Plugboard Pairing Count Check",
  description:
    "Audit explicit Enigma plugboard involution pairing/disjointness, accept0–13 pairs, no historical10-pair default or total Enigma keyspace claim.",
  inputs: inputFields,
  outputs: [
    { id: "usedLetters", label: "Used letters", kind: "string" },
    { id: "unpairedLetters", label: "Unpaired letters", kind: "string" },
    { id: "pairCount", label: "Pair count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ plugboardPairs: value.plugboardPairs as readonly string[] }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly ciphertext: string;
  readonly callerPlaintextRank: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "ciphertext", label: "Ciphertext", kind: "string" },
  { id: "callerPlaintextRank", label: "Caller plaintext rank", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (
    !/^[A-Z]{26}$(?![\s\S])/.test(i.callerPlaintextRank) ||
    new Set(i.callerPlaintextRank).size !== 26
  )
    simpleError("rank", "Permutation of uppercase ASCII alphabet.");
  if (!/^[A-Za-z\s]*$(?![\s\S])/.test(i.ciphertext))
    simpleError("text", "ASCII letters and whitespace only.");
  const text = i.ciphertext.toUpperCase(),
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    counts = [...alphabet].map((c) => [...text].filter((v) => v === c).length),
    rank = [...alphabet]
      .sort(
        (a, b) =>
          counts[alphabet.indexOf(b)] - counts[alphabet.indexOf(a)] ||
          alphabet.indexOf(a) - alphabet.indexOf(b),
      )
      .join("");
  return {
    observedAlphabetCounts: counts,
    observedCipherRank: rank,
    hypothesisPairs: [...rank].map(
      (c, j) => c + "→" + i.callerPlaintextRank[j],
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    ciphertext: "BBB AA C",
    callerPlaintextRank: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  },
  output: {
    result: {
      observedAlphabetCounts: [
        2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      observedCipherRank: "BACDEFGHIJKLMNOPQRSTUVWXYZ",
      hypothesisPairs: [
        "B→A",
        "A→B",
        "C→C",
        "D→D",
        "E→E",
        "F→F",
        "G→G",
        "H→H",
        "I→I",
        "J→J",
        "K→K",
        "L→L",
        "M→M",
        "N→N",
        "O→O",
        "P→P",
        "Q→Q",
        "R→R",
        "S→S",
        "T→T",
        "U→U",
        "V→V",
        "W→W",
        "X→X",
        "Y→Y",
        "Z→Z",
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/substitution-frequency-solver-assist",
  title: "Substitution Frequency Solver Assist",
  description:
    "Frequency-rank substitution assistance; zero-count ties alphabetic, mapping is only a caller-ranked hypothesis, not recovered plaintext.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;

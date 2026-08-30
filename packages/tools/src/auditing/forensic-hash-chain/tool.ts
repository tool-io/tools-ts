import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly storedHashes: readonly string[];
  readonly recomputedHashes: readonly string[];
}>;
export type Output = Readonly<{
  readonly mismatchIndexes: readonly number[];
  readonly verifiedCount: number;
  readonly mismatchCount: number;
  readonly chainIntact: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.storedHashes.length === 0 ||
    input.recomputedHashes.length !== input.storedHashes.length
  )
    simpleError(
      "storedHashes",
      "Hash lists must be aligned and nonempty.",
      "invalid_hashes",
    );
  const mismatchIndexes = input.storedHashes
    .map((value, index) =>
      value === input.recomputedHashes[index] ? -1 : index,
    )
    .filter((index) => index >= 0);
  return {
    mismatchIndexes,
    verifiedCount: input.storedHashes.length - mismatchIndexes.length,
    mismatchCount: mismatchIndexes.length,
    chainIntact: mismatchIndexes.length === 0,
  };
};

export const exampleInput = {
  storedHashes: ["a1", "b2", "c3"],
  recomputedHashes: ["a1", "b2", "x9"],
} satisfies Input;
export const exampleOutput = {
  mismatchIndexes: [2],
  verifiedCount: 2,
  mismatchCount: 1,
  chainIntact: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      storedHashes: input.storedHashes as readonly string[],
      recomputedHashes: input.recomputedHashes as readonly string[],
    }),
  description: "Compare stored and recomputed forensic evidence hashes.",
  id: "auditing/forensic-hash-chain",
  inputs: [
    { id: "storedHashes", label: "Stored evidence hashes", kind: "stringList" },
    {
      id: "recomputedHashes",
      label: "Recomputed evidence hashes",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "mismatchIndexes",
      label: "Zero-based hash mismatch indexes",
      kind: "numberList",
    },
    {
      id: "verifiedCount",
      label: "Verified hash count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "mismatchCount",
      label: "Hash mismatch count",
      kind: "integer",
      minimum: 0,
    },
    { id: "chainIntact", label: "All hashes match", kind: "boolean" },
  ],
  title: "Forensic Hash Chain",
});

export const run = tool.execute;
export default tool;

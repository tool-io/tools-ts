import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sentBases: readonly string[];
  readonly sentBits: readonly number[];
  readonly receivedBases: readonly string[];
  readonly receivedBits: readonly number[];
}>;
export type Output = Readonly<{
  readonly siftedBitCount: number;
  readonly errorCount: number;
  readonly quantumBitErrorPercent: number;
  readonly siftedIndexes: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.sentBases.length;
  if (
    n === 0 ||
    input.sentBits.length !== n ||
    input.receivedBases.length !== n ||
    input.receivedBits.length !== n
  )
    simpleError(
      "sentBases",
      "All BB84 lists must be aligned and nonempty.",
      "length_mismatch",
    );
  const siftedIndexes: number[] = [];
  let errorCount = 0;
  for (let i = 0; i < n; i += 1)
    if (input.sentBases[i] === input.receivedBases[i]) {
      siftedIndexes.push(i);
      if (input.sentBits[i] !== input.receivedBits[i]) errorCount += 1;
    }
  return {
    siftedBitCount: siftedIndexes.length,
    errorCount,
    quantumBitErrorPercent:
      siftedIndexes.length === 0
        ? 0
        : (errorCount / siftedIndexes.length) * 100,
    siftedIndexes,
  };
};

export const exampleInput = {
  sentBases: ["Z", "X", "Z", "X"],
  sentBits: [0, 1, 1, 0],
  receivedBases: ["Z", "Z", "Z", "X"],
  receivedBits: [0, 0, 0, 0],
} satisfies Input;
export const exampleOutput = {
  siftedBitCount: 3,
  errorCount: 1,
  quantumBitErrorPercent: 33.33333333333333,
  siftedIndexes: [0, 2, 3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sentBases: input.sentBases as readonly string[],
      sentBits: input.sentBits as readonly number[],
      receivedBases: input.receivedBases as readonly string[],
      receivedBits: input.receivedBits as readonly number[],
    }),
  description:
    "Sift aligned BB84 records and calculate the sifted-key error rate.",
  id: "laser/bb84-sift-error-analysis",
  inputs: [
    { id: "sentBases", label: "Sent bases", kind: "stringList" },
    { id: "sentBits", label: "Sent bits", kind: "numberList" },
    { id: "receivedBases", label: "Received bases", kind: "stringList" },
    { id: "receivedBits", label: "Received bits", kind: "numberList" },
  ],
  outputs: [
    {
      id: "siftedBitCount",
      label: "Sifted bit count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "errorCount",
      label: "Sifted error count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "quantumBitErrorPercent",
      label: "Quantum bit error rate",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "siftedIndexes", label: "Sifted indexes", kind: "numberList" },
  ],
  title: "BB84 Sift Error Analysis",
});

export const run = tool.execute;
export default tool;

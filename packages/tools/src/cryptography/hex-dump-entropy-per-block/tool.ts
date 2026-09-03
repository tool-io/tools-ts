import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  hex,
  entropy,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly hexDump: string;
  readonly blockBytes: number;
}>;
export type Output = Readonly<{
  readonly blockStartByteOffsets: readonly number[];
  readonly observedBlockByteCounts: readonly number[];
  readonly blockEntropyBitsPerByte: readonly number[];
}>;
const inputFields = [
  { id: "hexDump", label: "Hex dump", kind: "string" },
  { id: "blockBytes", label: "Block bytes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const values = hex(input.hexDump);
  bounded(input.blockBytes, "block", 1, 4096);
  const starts: number[] = [],
    counts: number[] = [],
    scores: number[] = [];
  for (let i = 0; i < values.length; i += input.blockBytes) {
    const block = values.slice(i, i + input.blockBytes);
    starts.push(i);
    counts.push(block.length);
    scores.push(entropy(block));
  }
  return {
    blockStartByteOffsets: starts,
    observedBlockByteCounts: counts,
    blockEntropyBitsPerByte: scores,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hexDump: "0001ffff",
  blockBytes: 2,
} satisfies Input;
export const exampleOutput = {
  blockStartByteOffsets: [0, 2],
  observedBlockByteCounts: [2, 2],
  blockEntropyBitsPerByte: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/hex-dump-entropy-per-block",
  title: "Hex-Dump Entropy Per Block",
  description:
    "Compute actual empirical byte entropy per explicit hex block including short final blocks, not ideal key entropy or secure randomness.",
  inputs: inputFields,
  outputs: [
    {
      id: "blockStartByteOffsets",
      label: "Block start byte offsets",
      kind: "numberList",
    },
    {
      id: "observedBlockByteCounts",
      label: "Observed block byte counts",
      kind: "numberList",
    },
    {
      id: "blockEntropyBitsPerByte",
      label: "Block entropy bits per byte",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      hexDump: value.hexDump as string,
      blockBytes: value.blockBytes as number,
    }),
});
export const run = tool.execute;
export default tool;

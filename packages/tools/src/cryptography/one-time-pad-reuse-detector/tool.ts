import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  simpleError,
  identifier,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly padIds: readonly string[];
  readonly startOffsets: readonly number[];
  readonly byteLengths: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "padIds", label: "Pad ids", kind: "stringList" },
  { id: "startOffsets", label: "Start offsets", kind: "numberList" },
  { id: "byteLengths", label: "Byte lengths", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  aligned(i.padIds, i.startOffsets, "ranges");
  aligned(i.padIds, i.byteLengths, "ranges");
  i.padIds.forEach((v) => {
    if (!v.trim()) simpleError("pad", "Explicit actual pad identifier.");
  });
  i.startOffsets.forEach((v) => bounded(v, "offset", 0, 1000000000));
  i.byteLengths.forEach((v) => bounded(v, "length", 1, 1000000000));
  const overlaps: number[][] = [];
  for (let a = 0; a < i.padIds.length; a++)
    for (let b = a + 1; b < i.padIds.length; b++)
      if (
        i.padIds[a] === i.padIds[b] &&
        Math.max(i.startOffsets[a], i.startOffsets[b]) <
          Math.min(
            i.startOffsets[a] + i.byteLengths[a],
            i.startOffsets[b] + i.byteLengths[b],
          )
      )
        overlaps.push([a, b]);
  return {
    overlappingRequestPairs: overlaps,
    reuseDetected: overlaps.length > 0,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    padIds: ["a", "a", "b"],
    startOffsets: [0, 3, 0],
    byteLengths: [4, 4, 4],
  },
  output: {
    result: { overlappingRequestPairs: [[0, 1]], reuseDetected: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/one-time-pad-reuse-detector",
  title: "One-Time-Pad Reuse Detector",
  description:
    "Detect overlap of independently identified actual one-time-pad byte ranges; not ciphertext analysis or proof of pad randomness.",
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

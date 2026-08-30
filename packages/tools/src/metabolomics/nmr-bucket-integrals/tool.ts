import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly chemicalShiftsPpm: readonly number[];
  readonly integrals: readonly number[];
  readonly bucketWidthPpm: number;
  readonly originPpm: number;
}>;
export type Output = Readonly<{
  readonly bucketIndexes: readonly number[];
  readonly bucketIntegrals: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.chemicalShiftsPpm.length;
  if (
    n === 0 ||
    n !== input.integrals.length ||
    input.bucketWidthPpm <= 0 ||
    input.integrals.some((v) => v < 0)
  )
    simpleError(
      "chemicalShiftsPpm",
      "Aligned shifts and nonnegative integrals required.",
    );
  const bucketIndexes = input.chemicalShiftsPpm.map((v) =>
      Math.floor((v - input.originPpm) / input.bucketWidthPpm),
    ),
    max = Math.max(...bucketIndexes),
    min = Math.min(...bucketIndexes);
  if (max - min > 10000)
    simpleError("bucketWidthPpm", "Bucket span exceeds safe output size.");
  const bucketIntegrals = Array(max - min + 1).fill(0);
  bucketIndexes.forEach(
    (v, i) => (bucketIntegrals[v - min] += input.integrals[i]),
  );
  return { bucketIndexes, bucketIntegrals };
};
export const exampleInput = {
  chemicalShiftsPpm: [0.01, 0.03, 0.07],
  integrals: [2, 4, 6],
  bucketWidthPpm: 0.04,
  originPpm: 0,
} satisfies Input;
export const exampleOutput = {
  bucketIndexes: [0, 0, 1],
  bucketIntegrals: [6, 6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nmr-bucket-integrals",
  title: "NMR Bucket Integrals",
  description:
    "Bin NMR spectral integrals by configurable chemical-shift width.",
  inputs: [
    {
      id: "chemicalShiftsPpm",
      kind: "numberList",
      label: "Chemical shifts ppm",
    },
    { id: "integrals", kind: "numberList", label: "Integrals" },
    { id: "bucketWidthPpm", kind: "number", label: "Bucket width ppm" },
    { id: "originPpm", kind: "number", label: "Origin ppm" },
  ],
  outputs: [
    { id: "bucketIndexes", kind: "numberList", label: "Bucket indexes" },
    { id: "bucketIntegrals", kind: "numberList", label: "Bucket integrals" },
  ],
  calculate: (value) =>
    calculate({
      chemicalShiftsPpm: value.chemicalShiftsPpm as readonly number[],
      integrals: value.integrals as readonly number[],
      bucketWidthPpm: value.bucketWidthPpm as number,
      originPpm: value.originPpm as number,
    }),
});
export const run = tool.execute;
export default tool;

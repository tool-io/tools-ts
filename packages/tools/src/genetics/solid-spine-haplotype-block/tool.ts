import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly snpIds: readonly string[];
  readonly dprimeMatrix: readonly (readonly number[])[];
  readonly minimumAbsoluteDprime: number;
}>;
export type Output = Readonly<{
  readonly blockEndIndex: number;
  readonly blockSnps: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.snpIds.length;
  fraction(input.minimumAbsoluteDprime, "minimumAbsoluteDprime");
  if (
    !n ||
    n > 128 ||
    new Set(input.snpIds).size !== n ||
    input.dprimeMatrix.length !== n ||
    input.dprimeMatrix.some(
      (row, i) =>
        row.length !== n ||
        row.some(
          (v, j) =>
            !Number.isFinite(v) ||
            Math.abs(v) > 1 ||
            Math.abs(v - input.dprimeMatrix[j]?.[i]) > 1e-10,
        ),
    )
  )
    simpleError(
      "dprimeMatrix",
      "Square symmetric aligned signed D-prime matrix with distinct SNP IDs required, at most 128 SNPs.",
    );
  let blockEndIndex = 0;
  for (let end = 1; end < n; end++) {
    let supported = true;
    for (let j = 0; j <= end; j++)
      if (
        (j !== 0 &&
          Math.abs(input.dprimeMatrix[0][j]) < input.minimumAbsoluteDprime) ||
        (j !== end &&
          Math.abs(input.dprimeMatrix[end][j]) < input.minimumAbsoluteDprime)
      )
        supported = false;
    if (!supported) break;
    blockEndIndex = end;
  }
  return { blockEndIndex, blockSnps: input.snpIds.slice(0, blockEndIndex + 1) };
};
export const exampleInput = {
  snpIds: ["A", "B", "C"],
  dprimeMatrix: [
    [1, 0.9, 0.9],
    [0.9, 1, 0.2],
    [0.9, 0.2, 1],
  ],
  minimumAbsoluteDprime: 0.8,
} satisfies Input;
export const exampleOutput = {
  blockEndIndex: 1,
  blockSnps: ["A", "B"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/solid-spine-haplotype-block",
  title: "Solid Spine Haplotype Block",
  description:
    "Extend a solid-spine block from the first SNP while both boundary SNPs retain caller-required linkage with all enclosed SNPs.",
  inputs: [
    { id: "snpIds", label: "Snp ids", kind: "stringList" },
    { id: "dprimeMatrix", label: "Dprime matrix", kind: "matrix" },
    {
      id: "minimumAbsoluteDprime",
      label: "Minimum absolute dprime",
      kind: "number",
    },
  ],
  outputs: [
    { id: "blockEndIndex", label: "Block end index", kind: "number" },
    { id: "blockSnps", label: "Block snps", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      snpIds: value.snpIds as readonly string[],
      dprimeMatrix: value.dprimeMatrix as readonly (readonly number[])[],
      minimumAbsoluteDprime: value.minimumAbsoluteDprime as number,
    }),
});
export const run = tool.execute;
export default tool;

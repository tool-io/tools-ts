import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dropletUmis: readonly number[];
  readonly minimumCellUmis: number;
}>;
export type Output = Readonly<{
  readonly cellIndexes: readonly number[];
  readonly emptyIndexes: readonly number[];
  readonly cellFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.dropletUmis.length === 0 ||
    input.dropletUmis.some((v) => v < 0) ||
    input.minimumCellUmis < 0
  )
    simpleError("dropletUmis", "Nonnegative droplet UMI totals are required.");
  const cellIndexes = input.dropletUmis.flatMap((v, i) =>
      v >= input.minimumCellUmis ? [i] : [],
    ),
    emptyIndexes = input.dropletUmis.flatMap((v, i) =>
      v < input.minimumCellUmis ? [i] : [],
    );
  return {
    cellIndexes,
    emptyIndexes,
    cellFraction: (cellIndexes.length / input.dropletUmis.length) * 100,
  };
};

export const exampleInput = {
  dropletUmis: [10, 100, 500],
  minimumCellUmis: 100,
} satisfies Input;
export const exampleOutput = {
  cellIndexes: [1, 2],
  emptyIndexes: [0],
  cellFraction: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/empty-droplet-filter",
  title: "Empty Droplet Filter",
  description: "Classify droplets by a caller-supplied minimum UMI count.",
  inputs: [
    { id: "dropletUmis", kind: "numberList", label: "Droplet umis" },
    { id: "minimumCellUmis", kind: "number", label: "Minimum cell umis" },
  ],
  outputs: [
    { id: "cellIndexes", kind: "numberList", label: "Cell indexes" },
    { id: "emptyIndexes", kind: "numberList", label: "Empty indexes" },
    { id: "cellFraction", kind: "number", label: "Cell fraction" },
  ],
  calculate: (value) =>
    calculate({
      dropletUmis: value.dropletUmis as readonly number[],
      minimumCellUmis: value.minimumCellUmis as number,
    }),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cellIds: readonly string[];
  readonly pseudotimes: readonly number[];
}>;
export type Output = Readonly<{
  readonly rootCellId: string;
  readonly rootIndex: number;
  readonly maximumPseudotime: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cellIds.length === 0 ||
    input.cellIds.length !== input.pseudotimes.length
  )
    simpleError("cellIds", "Aligned cell IDs and pseudotimes are required.");
  const rootIndex = input.pseudotimes.indexOf(Math.min(...input.pseudotimes));
  return {
    rootCellId: input.cellIds[rootIndex],
    rootIndex,
    maximumPseudotime: Math.max(...input.pseudotimes),
  };
};

export const exampleInput = {
  cellIds: ["a", "b", "c"],
  pseudotimes: [0.5, 0.1, 0.9],
} satisfies Input;
export const exampleOutput = {
  rootCellId: "b",
  rootIndex: 1,
  maximumPseudotime: 0.9,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/pseudotime-root-selector",
  title: "Pseudotime Root Selector",
  description: "Select the earliest cell as the pseudotime trajectory root.",
  inputs: [
    { id: "cellIds", kind: "stringList", label: "Cell ids" },
    { id: "pseudotimes", kind: "numberList", label: "Pseudotimes" },
  ],
  outputs: [
    { id: "rootCellId", kind: "string", label: "Root cell id" },
    { id: "rootIndex", kind: "number", label: "Root index" },
    { id: "maximumPseudotime", kind: "number", label: "Maximum pseudotime" },
  ],
  calculate: (value) =>
    calculate({
      cellIds: value.cellIds as readonly string[],
      pseudotimes: value.pseudotimes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;

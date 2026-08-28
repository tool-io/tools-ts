import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParallelInductorCurrentInput = {
  readonly totalCurrentA: number;
  readonly l1: number;
  readonly l2: number;
};

export type ParallelInductorCurrentOutput = {
  readonly currentThroughL1A: number;
};

export const parallelInductorCurrentExample = {
  input: { totalCurrentA: 3, l1: 1, l2: 2 },
  output: { currentThroughL1A: 2 },
} satisfies ToolExample<
  ParallelInductorCurrentInput,
  ParallelInductorCurrentOutput
>;

export const parallelInductorCurrentTool = createSimpleTool({
  id: "electronics/parallel-inductor-current",
  title: "Parallel Inductor Current Split",
  description:
    "Compute the current through L1 of a parallel pair as total current times L2 / (L1 + L2).",
  inputs: [
    { id: "totalCurrentA", label: "Total current", kind: "number", unit: "A" },
    { id: "l1", label: "Inductance L1", kind: "number", unit: "H" },
    { id: "l2", label: "Inductance L2", kind: "number", unit: "H" },
  ],
  outputs: [
    {
      id: "currentThroughL1A",
      label: "Current through L1",
      kind: "number",
      unit: "A",
    },
  ],
  calculate: (input) => {
    const l1 = input.l1 as number;
    const l2 = input.l2 as number;
    if (!(l1 > 0))
      simpleError("l1", "L1 must be positive.", "invalid_inductance");
    if (!(l2 > 0))
      simpleError("l2", "L2 must be positive.", "invalid_inductance");
    return {
      currentThroughL1A: (input.totalCurrentA as number) * (l2 / (l1 + l2)),
    };
  },
});
export const runParallelInductorCurrent = parallelInductorCurrentTool.execute;
export default parallelInductorCurrentTool;

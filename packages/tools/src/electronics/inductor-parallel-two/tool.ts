import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const inductorParallelTwoExample = {
  input: { l1H: 0.002, l2H: 0.002 },
} satisfies ToolExample<{ readonly l1H: number; readonly l2H: number }>;

export const inductorParallelTwoTool = createSimpleTool({
  id: "electronics/inductor-parallel-two",
  title: "Parallel Inductors",
  description:
    "Calculate the total inductance of two inductors connected in parallel.",
  inputs: [
    { id: "l1H", label: "Inductance 1", kind: "number", unit: "H" },
    { id: "l2H", label: "Inductance 2", kind: "number", unit: "H" },
  ],
  outputs: [
    {
      id: "totalInductanceH",
      label: "Total inductance",
      kind: "number",
      unit: "H",
    },
  ],
  calculate: (input) => {
    const l1H = input.l1H as number;
    const l2H = input.l2H as number;
    if (l1H <= 0) simpleError("l1H", "Inductance 1 must be positive.");
    if (l2H <= 0) simpleError("l2H", "Inductance 2 must be positive.");
    return { totalInductanceH: 1 / (1 / l1H + 1 / l2H) };
  },
});
export const runInductorParallelTwo = inductorParallelTwoTool.execute;
export default inductorParallelTwoTool;

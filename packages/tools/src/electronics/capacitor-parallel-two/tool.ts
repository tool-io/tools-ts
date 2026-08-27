import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const capacitorParallelTwoExample = {
  input: { c1F: 0.000002, c2F: 0.000003 },
} satisfies ToolExample<{ readonly c1F: number; readonly c2F: number }>;

export const capacitorParallelTwoTool = createSimpleTool({
  id: "electronics/capacitor-parallel-two",
  title: "Parallel Capacitors",
  description:
    "Calculate the total capacitance of two capacitors connected in parallel.",
  inputs: [
    { id: "c1F", label: "Capacitance 1", kind: "number", unit: "F" },
    { id: "c2F", label: "Capacitance 2", kind: "number", unit: "F" },
  ],
  outputs: [
    {
      id: "totalCapacitanceF",
      label: "Total capacitance",
      kind: "number",
      unit: "F",
    },
  ],
  calculate: (input) => ({
    totalCapacitanceF: (input.c1F as number) + (input.c2F as number),
  }),
});
export const runCapacitorParallelTwo = capacitorParallelTwoTool.execute;
export default capacitorParallelTwoTool;

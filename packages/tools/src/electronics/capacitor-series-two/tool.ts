import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const capacitorSeriesTwoExample = {
  input: { c1F: 0.000003, c2F: 0.000006 },
} satisfies ToolExample<{ readonly c1F: number; readonly c2F: number }>;

export const capacitorSeriesTwoTool = createSimpleTool({
  id: "electronics/capacitor-series-two",
  title: "Series Capacitors",
  description:
    "Calculate the total capacitance of two capacitors connected in series.",
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
  calculate: (input) => {
    const c1F = input.c1F as number;
    const c2F = input.c2F as number;
    if (c1F <= 0) simpleError("c1F", "Capacitance 1 must be positive.");
    if (c2F <= 0) simpleError("c2F", "Capacitance 2 must be positive.");
    return { totalCapacitanceF: 1 / (1 / c1F + 1 / c2F) };
  },
});
export const runCapacitorSeriesTwo = capacitorSeriesTwoTool.execute;
export default capacitorSeriesTwoTool;

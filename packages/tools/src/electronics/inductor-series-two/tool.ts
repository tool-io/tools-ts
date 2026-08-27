import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const inductorSeriesTwoExample = {
  input: { l1H: 0.002, l2H: 0.003 },
} satisfies ToolExample<{ readonly l1H: number; readonly l2H: number }>;

export const inductorSeriesTwoTool = createSimpleTool({
  id: "electronics/inductor-series-two",
  title: "Series Inductors",
  description:
    "Calculate the total inductance of two inductors connected in series.",
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
  calculate: (input) => ({
    totalInductanceH: (input.l1H as number) + (input.l2H as number),
  }),
});
export const runInductorSeriesTwo = inductorSeriesTwoTool.execute;
export default inductorSeriesTwoTool;

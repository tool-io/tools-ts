import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hemocytometerCountExample = {
  input: { avgCellsPerSquare: 45, dilutionFactor: 2 },
} satisfies ToolExample<{
  readonly avgCellsPerSquare: number;
  readonly dilutionFactor: number;
}>;

export const hemocytometerCountTool = createSimpleTool({
  id: "biology/hemocytometer-count",
  title: "Hemocytometer Cell Count",
  description:
    "Convert the average cells per hemocytometer square into cells per milliliter.",
  inputs: [
    {
      id: "avgCellsPerSquare",
      label: "Average cells per square",
      kind: "number",
      minimum: 0,
    },
    {
      default: 1,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "cellsPerMl",
      label: "Cell concentration",
      kind: "number",
      unit: "cells/mL",
    },
  ],
  calculate: (input) => ({
    cellsPerMl:
      (input.avgCellsPerSquare as number) *
      (input.dilutionFactor as number) *
      10000,
  }),
});
export const runHemocytometerCount = hemocytometerCountTool.execute;
export default hemocytometerCountTool;

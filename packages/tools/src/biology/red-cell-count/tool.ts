import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const redCellCountExample = {
  input: { countedCells: 20, dilutionFactor: 200 },
  output: { rbcMillionPerUl: 400 },
} satisfies ToolExample<
  { readonly countedCells: number; readonly dilutionFactor: number },
  { readonly rbcMillionPerUl: number }
>;

export const redCellCountTool = createSimpleTool({
  id: "biology/red-cell-count",
  title: "Red Cell Concentration",
  description:
    "Convert cells counted in a hemocytometer square into a red cell concentration in millions per microliter using countedCells x dilutionFactor / 10.",
  inputs: [
    {
      id: "countedCells",
      label: "Counted cells",
      kind: "number",
      minimum: 0,
    },
    {
      default: 200,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "rbcMillionPerUl",
      label: "Red cell concentration",
      kind: "number",
      unit: "million/uL",
    },
  ],
  calculate: (input) => ({
    rbcMillionPerUl:
      ((input.countedCells as number) * (input.dilutionFactor as number)) / 10,
  }),
});
export const runRedCellCount = redCellCountTool.execute;
export default redCellCountTool;

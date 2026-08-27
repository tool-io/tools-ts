import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const whiteCellDifferentialExample = {
  input: { neutrophilPercent: 62, totalWbcPerUl: 7500 },
  output: { absoluteNeutrophilsPerUl: 4650 },
} satisfies ToolExample<
  { readonly neutrophilPercent: number; readonly totalWbcPerUl: number },
  { readonly absoluteNeutrophilsPerUl: number }
>;

export const whiteCellDifferentialTool = createSimpleTool({
  id: "biology/white-cell-differential",
  title: "Differential Absolute Neutrophil",
  description:
    "Compute the absolute neutrophil count from the neutrophil differential percentage and the total white blood cell count.",
  inputs: [
    {
      id: "neutrophilPercent",
      label: "Neutrophil percent",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "totalWbcPerUl",
      label: "Total white blood cells",
      kind: "number",
      unit: "cells/uL",
    },
  ],
  outputs: [
    {
      id: "absoluteNeutrophilsPerUl",
      label: "Absolute neutrophils",
      kind: "number",
      unit: "cells/uL",
    },
  ],
  calculate: (input) => {
    const totalWbcPerUl = input.totalWbcPerUl as number;
    if (totalWbcPerUl <= 0)
      simpleError(
        "totalWbcPerUl",
        "Total white blood cell count must be greater than zero.",
      );
    return {
      absoluteNeutrophilsPerUl:
        ((input.neutrophilPercent as number) * totalWbcPerUl) / 100,
    };
  },
});
export const runWhiteCellDifferential = whiteCellDifferentialTool.execute;
export default whiteCellDifferentialTool;

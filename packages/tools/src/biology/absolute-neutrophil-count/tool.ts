import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AbsoluteNeutrophilCountInput = {
  readonly wbcKPerUl: number;
  readonly neutrophilPercent: number;
};

export type AbsoluteNeutrophilCountOutput = {
  readonly ancCellsPerUl: number;
};

export const absoluteNeutrophilCountExample = {
  input: { wbcKPerUl: 6, neutrophilPercent: 60 },
  output: { ancCellsPerUl: 3600 },
} satisfies ToolExample<
  AbsoluteNeutrophilCountInput,
  AbsoluteNeutrophilCountOutput
>;

export const absoluteNeutrophilCountTool = createSimpleTool({
  id: "biology/absolute-neutrophil-count",
  title: "ANC Calculator",
  description:
    "Compute absolute neutrophil count from white blood cell count and neutrophil percentage.",
  inputs: [
    {
      id: "wbcKPerUl",
      kind: "number",
      label: "White blood cell count",
      minimum: 0,
      unit: "K/µL",
    },
    {
      id: "neutrophilPercent",
      kind: "number",
      label: "Neutrophil percentage",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "ancCellsPerUl",
      kind: "number",
      label: "Absolute neutrophil count",
      unit: "cells/µL",
    },
  ],
  calculate: (input) => ({
    ancCellsPerUl:
      (((input.wbcKPerUl as number) * (input.neutrophilPercent as number)) /
        100) *
      1000,
  }),
});
export const runAbsoluteNeutrophilCount = absoluteNeutrophilCountTool.execute;
export default absoluteNeutrophilCountTool;

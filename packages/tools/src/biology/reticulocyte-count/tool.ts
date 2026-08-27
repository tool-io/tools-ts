import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ReticulocyteCountInput = {
  readonly reticulocytePercent: number;
  readonly rbcMillionPerUl: number;
};

export type ReticulocyteCountOutput = {
  readonly absoluteReticulocytesPerUl: number;
};

export const reticulocyteCountExample = {
  input: { reticulocytePercent: 2, rbcMillionPerUl: 4.5 },
  output: { absoluteReticulocytesPerUl: 90 },
} satisfies ToolExample<ReticulocyteCountInput, ReticulocyteCountOutput>;

export const reticulocyteCountTool = createSimpleTool({
  id: "biology/reticulocyte-count",
  title: "Absolute Reticulocytes",
  description:
    "Compute absolute reticulocyte count from reticulocyte percentage and RBC count.",
  inputs: [
    {
      id: "reticulocytePercent",
      kind: "number",
      label: "Reticulocyte percentage",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "rbcMillionPerUl",
      kind: "number",
      label: "Red blood cell count",
      minimum: Number.MIN_VALUE,
      unit: "million/µL",
    },
  ],
  outputs: [
    {
      id: "absoluteReticulocytesPerUl",
      kind: "number",
      label: "Absolute reticulocytes",
      unit: "cells/µL",
    },
  ],
  calculate: (input) => ({
    absoluteReticulocytesPerUl:
      ((input.reticulocytePercent as number) *
        (input.rbcMillionPerUl as number) *
        1000) /
      100,
  }),
});
export const runReticulocyteCount = reticulocyteCountTool.execute;
export default reticulocyteCountTool;

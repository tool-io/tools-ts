import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbsoluteReticulocyteCountInput = {
  readonly rbcMillionPerUl: number;
  readonly reticulocytePercent: number;
};

export type AbsoluteReticulocyteCountOutput = {
  readonly absoluteReticulocytesKPerUl: number;
};

export const absoluteReticulocyteCountExample = {
  input: { rbcMillionPerUl: 4.25, reticulocytePercent: 3 },
  output: { absoluteReticulocytesKPerUl: 127.5 },
} satisfies ToolExample<
  AbsoluteReticulocyteCountInput,
  AbsoluteReticulocyteCountOutput
>;

export const absoluteReticulocyteCountTool = createSimpleTool({
  id: "biology/absolute-reticulocyte-count",
  title: "ARC From Percent",
  description:
    "Compute the absolute reticulocyte count in thousands per microlitre as the reticulocyte percent times the RBC count in millions per microlitre times ten.",
  inputs: [
    {
      id: "reticulocytePercent",
      label: "Reticulocytes",
      kind: "number",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "rbcMillionPerUl",
      label: "RBC count",
      kind: "number",
      minimum: 0,
      unit: "million/µL",
    },
  ],
  outputs: [
    {
      id: "absoluteReticulocytesKPerUl",
      label: "Absolute reticulocytes",
      kind: "number",
      unit: "K/µL",
    },
  ],
  calculate: (input) => {
    const rbcMillionPerUl = input.rbcMillionPerUl as number;
    if (rbcMillionPerUl < 0)
      simpleError("rbcMillionPerUl", "The RBC count cannot be negative.");
    return {
      absoluteReticulocytesKPerUl:
        (input.reticulocytePercent as number) * rbcMillionPerUl * 10,
    };
  },
});
export const runAbsoluteReticulocyteCount =
  absoluteReticulocyteCountTool.execute;
export default absoluteReticulocyteCountTool;

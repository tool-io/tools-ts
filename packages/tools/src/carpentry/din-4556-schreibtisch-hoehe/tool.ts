import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Din4556DeskClass = "adjustable" | "fixed";

export type Din4556DeskHeightInput = {
  readonly deskClass: Din4556DeskClass;
};

export type Din4556DeskHeightOutput = {
  readonly adjustmentRangeMm?: number;
  readonly workHeightMm: number;
};

export const din4556DeskHeightExample = {
  input: { deskClass: "adjustable" },
  output: { adjustmentRangeMm: 80, workHeightMm: 680 },
} satisfies ToolExample<Din4556DeskHeightInput, Din4556DeskHeightOutput>;

export const din4556DeskHeightTool = createSimpleTool({
  id: "carpentry/din-4556-schreibtisch-hoehe",
  title: "DIN 4556 Desk Height Lookup",
  description:
    "Look up the DIN 4556 standard work height of 680 mm and the adjustment range of height-adjustable desks.",
  inputs: [
    {
      description:
        "Fixed desks return only the work height; adjustable desks add the adjustment range.",
      enum: ["fixed", "adjustable"],
      id: "deskClass",
      kind: "string",
      label: "Desk class",
    },
  ],
  outputs: [
    {
      description: "Standard work height according to DIN 4556.",
      id: "workHeightMm",
      kind: "number",
      label: "Work height",
      unit: "mm",
    },
    {
      description: "Adjustment range; returned only for adjustable desks.",
      id: "adjustmentRangeMm",
      kind: "number",
      label: "Adjustment range",
      required: false,
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const deskClass = input.deskClass as Din4556DeskClass;
    if (deskClass !== "adjustable" && deskClass !== "fixed")
      simpleError(
        "deskClass",
        "Choose one of the supported desk classes.",
        "unknown_desk_class",
      );
    return deskClass === "adjustable"
      ? { adjustmentRangeMm: 80, workHeightMm: 680 }
      : { workHeightMm: 680 };
  },
});
export const runDin4556DeskHeight = din4556DeskHeightTool.execute;
export default din4556DeskHeightTool;

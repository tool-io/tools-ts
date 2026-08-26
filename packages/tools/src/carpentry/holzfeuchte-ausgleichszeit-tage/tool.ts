import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const woodAcclimatizationTimeExample = {
  input: { thicknessMm: 25 },
  output: { acclimatizationDays: 30 },
} satisfies ToolExample<
  { readonly thicknessMm: number },
  { readonly acclimatizationDays: number }
>;

export const woodAcclimatizationTimeTool = createSimpleTool({
  id: "carpentry/holzfeuchte-ausgleichszeit-tage",
  title: "Wood Acclimatization Time Calculator",
  description:
    "Estimate lumber acclimatization time at about one month per 25 mm of thickness.",
  inputs: [
    {
      description: "Lumber thickness in millimeters.",
      id: "thicknessMm",
      kind: "number",
      label: "Thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Estimated acclimatization time in days.",
      id: "acclimatizationDays",
      kind: "integer",
      label: "Acclimatization time",
      unit: "days",
    },
  ],
  calculate: (input) => {
    const thicknessMm = input.thicknessMm as number;
    if (thicknessMm <= 0)
      simpleError(
        "thicknessMm",
        "Thickness must be positive.",
        "must_be_positive",
      );
    return {
      acclimatizationDays: Math.round((thicknessMm / 25) * 30),
    };
  },
});
export const runWoodAcclimatizationTime = woodAcclimatizationTimeTool.execute;
export default woodAcclimatizationTimeTool;

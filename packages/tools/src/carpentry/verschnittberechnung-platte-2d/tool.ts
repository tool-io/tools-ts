import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const panelOffcutExample = {
  input: { panelAreaM2: 5, usedAreaM2: 3.75 },
  output: { offcutPercent: 25 },
} satisfies ToolExample<
  { readonly panelAreaM2: number; readonly usedAreaM2: number },
  { readonly offcutPercent: number }
>;

export const panelOffcutTool = createSimpleTool({
  id: "carpentry/verschnittberechnung-platte-2d",
  title: "Panel Offcut Percentage Calculator",
  description:
    "Calculate the percentage of a panel area left as offcut from the used area.",
  inputs: [
    { id: "panelAreaM2", kind: "number", label: "Panel area", unit: "m²" },
    { id: "usedAreaM2", kind: "number", label: "Used area", unit: "m²" },
  ],
  outputs: [
    {
      format: "percent",
      id: "offcutPercent",
      kind: "number",
      label: "Offcut percentage",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const panelAreaM2 = input.panelAreaM2 as number;
    const usedAreaM2 = input.usedAreaM2 as number;
    if (!(panelAreaM2 > 0))
      simpleError(
        "panelAreaM2",
        "Panel area must be positive.",
        "invalid_panel_area",
      );
    if (!(usedAreaM2 >= 0) || usedAreaM2 > panelAreaM2)
      simpleError(
        "usedAreaM2",
        "Used area must be nonnegative and not exceed the panel area.",
        "invalid_used_area",
      );
    return { offcutPercent: (1 - usedAreaM2 / panelAreaM2) * 100 };
  },
});
export const runPanelOffcut = panelOffcutTool.execute;
export default panelOffcutTool;

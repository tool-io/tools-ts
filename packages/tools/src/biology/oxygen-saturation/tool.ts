import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const oxygenSaturationExample = {
  input: { spo2Percent: 97 },
  output: { category: "normal" },
} satisfies ToolExample<
  { readonly spo2Percent: number },
  { readonly category: string }
>;

export const oxygenSaturationTool = createSimpleTool({
  id: "biology/oxygen-saturation",
  title: "O2 Saturation Category",
  description:
    "Classify peripheral oxygen saturation as hypoxemic (below 90), borderline (90 to below 95) or normal (95 to 100).",
  inputs: [
    {
      id: "spo2Percent",
      kind: "number",
      label: "SpO2",
      maximum: 100,
      minimum: 50,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "category",
      kind: "string",
      label: "Oxygen saturation category",
    },
  ],
  calculate: (input) => {
    const spo2Percent = input.spo2Percent as number;
    return {
      category:
        spo2Percent < 90
          ? "hypoxemic"
          : spo2Percent < 95
            ? "borderline"
            : "normal",
    };
  },
});
export const runOxygenSaturation = oxygenSaturationTool.execute;
export default oxygenSaturationTool;

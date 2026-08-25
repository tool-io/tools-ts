import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const correctedCalciumExample = {
  input: { albuminGDl: 2.5, measuredCalciumMgDl: 8.5 },
  output: { correctedCalciumMgDl: 9.7 },
} satisfies ToolExample<
  { readonly albuminGDl: number; readonly measuredCalciumMgDl: number },
  { readonly correctedCalciumMgDl: number }
>;

export const correctedCalciumTool = createSimpleTool({
  id: "biology/corrected-calcium",
  title: "Corrected Calcium",
  description:
    "Adjust measured calcium for hypoalbuminemia with the 0.8 correction.",
  inputs: [
    {
      id: "measuredCalciumMgDl",
      kind: "number",
      label: "Measured calcium",
      minimum: 0,
      unit: "mg/dL",
    },
    {
      id: "albuminGDl",
      kind: "number",
      label: "Albumin",
      minimum: Number.MIN_VALUE,
      unit: "g/dL",
    },
  ],
  outputs: [
    {
      id: "correctedCalciumMgDl",
      kind: "number",
      label: "Corrected calcium",
      unit: "mg/dL",
    },
  ],
  calculate: (input) => ({
    correctedCalciumMgDl:
      (input.measuredCalciumMgDl as number) +
      0.8 * (4 - (input.albuminGDl as number)),
  }),
});
export const runCorrectedCalcium = correctedCalciumTool.execute;
export default correctedCalciumTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const qtcBazettExample = {
  input: { qtMs: 400, rrSeconds: 0.8 },
  output: { correctedQtMs: 447.21359549995793 },
} satisfies ToolExample<
  { readonly qtMs: number; readonly rrSeconds: number },
  { readonly correctedQtMs: number }
>;

export const qtcBazettTool = createSimpleTool({
  id: "biology/qtc-bazett",
  title: "QTc Bazett",
  description:
    "Correct the QT interval for heart rate with the Bazett formula.",
  inputs: [
    {
      id: "qtMs",
      kind: "number",
      label: "QT interval",
      minimum: Number.MIN_VALUE,
      unit: "ms",
    },
    {
      id: "rrSeconds",
      kind: "number",
      label: "RR interval",
      minimum: Number.MIN_VALUE,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "correctedQtMs",
      kind: "number",
      label: "Corrected QT interval",
      unit: "ms",
    },
  ],
  calculate: (input) => ({
    correctedQtMs:
      (input.qtMs as number) / Math.sqrt(input.rrSeconds as number),
  }),
});
export const runQtcBazett = qtcBazettTool.execute;
export default qtcBazettTool;

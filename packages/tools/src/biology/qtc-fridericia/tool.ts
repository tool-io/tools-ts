import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const qtcFridericiaExample = {
  input: { qtMs: 400, rrSeconds: 0.8 },
  output: { correctedQtMs: 430.88693800637674 },
} satisfies ToolExample<
  { readonly qtMs: number; readonly rrSeconds: number },
  { readonly correctedQtMs: number }
>;

export const qtcFridericiaTool = createSimpleTool({
  id: "biology/qtc-fridericia",
  title: "QTc Fridericia",
  description:
    "Correct the QT interval for heart rate with the Fridericia formula.",
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
      (input.qtMs as number) / Math.cbrt(input.rrSeconds as number),
  }),
});
export const runQtcFridericia = qtcFridericiaTool.execute;
export default qtcFridericiaTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchlitzZapfenMasse13RegelInput = Readonly<{
  readonly stockThicknessMillimeters: number;
}>;
export type SchlitzZapfenMasse13RegelOutput = Readonly<{
  readonly tenonThicknessMillimeters: number;
  readonly shoulderEachSideMillimeters: number;
}>;

export const calculateSchlitzZapfenMasse13Regel = (
  x: SchlitzZapfenMasse13RegelInput,
): SchlitzZapfenMasse13RegelOutput => {
  if (
    !Number.isFinite(x.stockThicknessMillimeters) ||
    x.stockThicknessMillimeters < 0
  )
    simpleError(
      "stockThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  const tenonThicknessMillimeters = x.stockThicknessMillimeters / 3;
  if (!Number.isFinite(tenonThicknessMillimeters))
    simpleError(
      "tenonThicknessMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  const shoulderEachSideMillimeters =
    (x.stockThicknessMillimeters - x.stockThicknessMillimeters / 3) / 2;
  if (!Number.isFinite(shoulderEachSideMillimeters))
    simpleError(
      "shoulderEachSideMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tenonThicknessMillimeters: Object.is(tenonThicknessMillimeters, -0)
      ? 0
      : tenonThicknessMillimeters,
    shoulderEachSideMillimeters: Object.is(shoulderEachSideMillimeters, -0)
      ? 0
      : shoulderEachSideMillimeters,
  };
};

export const example = {
  input: { stockThicknessMillimeters: 30 },
  output: { tenonThicknessMillimeters: 10, shoulderEachSideMillimeters: 10 },
} satisfies ToolExample<
  SchlitzZapfenMasse13RegelInput,
  SchlitzZapfenMasse13RegelOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/schlitz-zapfen-masse-1-3-regel",
  title: "Schlitz Zapfen Masse 1 3 Regel",
  description:
    "One-third-rule tenon thickness and equal shoulder widths from stock thickness; these are starting dimensions, not a strength check.",
  inputs: [
    {
      id: "stockThicknessMillimeters",
      kind: "number",
      label: "Stock Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tenonThicknessMillimeters",
      kind: "number",
      label: "Tenon Thickness Millimeters",
      unit: "mm",
    },
    {
      id: "shoulderEachSideMillimeters",
      kind: "number",
      label: "Shoulder Each Side Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSchlitzZapfenMasse13Regel({
      stockThicknessMillimeters: input.stockThicknessMillimeters as number,
    }),
});
export const schlitzZapfenMasse13RegelTool = tool;
export const runSchlitzZapfenMasse13Regel = tool.execute;
export default tool;

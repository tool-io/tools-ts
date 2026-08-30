import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UeberblattungTiefeHalfInput = Readonly<{
  readonly stockThicknessMillimeters: number;
}>;
export type UeberblattungTiefeHalfOutput = Readonly<{
  readonly cutDepthMillimeters: number;
}>;

export const calculateUeberblattungTiefeHalf = (
  x: UeberblattungTiefeHalfInput,
): UeberblattungTiefeHalfOutput => {
  if (
    !Number.isFinite(x.stockThicknessMillimeters) ||
    x.stockThicknessMillimeters < 0
  )
    simpleError(
      "stockThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  const cutDepthMillimeters = x.stockThicknessMillimeters / 2;
  if (!Number.isFinite(cutDepthMillimeters))
    simpleError(
      "cutDepthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cutDepthMillimeters: Object.is(cutDepthMillimeters, -0)
      ? 0
      : cutDepthMillimeters,
  };
};

export const example = {
  input: { stockThicknessMillimeters: 20 },
  output: { cutDepthMillimeters: 10 },
} satisfies ToolExample<
  UeberblattungTiefeHalfInput,
  UeberblattungTiefeHalfOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/ueberblattung-tiefe-half",
  title: "Ueberblattung Tiefe Half",
  description:
    "Cut depth for a centered half-lap joint in a board of uniform thickness.",
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
      id: "cutDepthMillimeters",
      kind: "number",
      label: "Cut Depth Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateUeberblattungTiefeHalf({
      stockThicknessMillimeters: input.stockThicknessMillimeters as number,
    }),
});
export const ueberblattungTiefeHalfTool = tool;
export const runUeberblattungTiefeHalf = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FederNutMasse13RegelInput = Readonly<{
  readonly stockThicknessMillimeters: number;
  readonly fitClearanceMillimeters: number;
}>;
export type FederNutMasse13RegelOutput = Readonly<{
  readonly tongueThicknessMillimeters: number;
  readonly grooveWidthMillimeters: number;
}>;

export const calculateFederNutMasse13Regel = (
  x: FederNutMasse13RegelInput,
): FederNutMasse13RegelOutput => {
  if (
    !Number.isFinite(x.stockThicknessMillimeters) ||
    x.stockThicknessMillimeters < 0
  )
    simpleError(
      "stockThicknessMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.fitClearanceMillimeters) ||
    x.fitClearanceMillimeters < 0
  )
    simpleError(
      "fitClearanceMillimeters",
      "Provide a finite number at least 0.",
    );
  const tongueThicknessMillimeters = x.stockThicknessMillimeters / 3;
  if (!Number.isFinite(tongueThicknessMillimeters))
    simpleError(
      "tongueThicknessMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  const grooveWidthMillimeters =
    x.stockThicknessMillimeters / 3 + x.fitClearanceMillimeters;
  if (!Number.isFinite(grooveWidthMillimeters))
    simpleError(
      "grooveWidthMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    tongueThicknessMillimeters: Object.is(tongueThicknessMillimeters, -0)
      ? 0
      : tongueThicknessMillimeters,
    grooveWidthMillimeters: Object.is(grooveWidthMillimeters, -0)
      ? 0
      : grooveWidthMillimeters,
  };
};

export const example = {
  input: { stockThicknessMillimeters: 18, fitClearanceMillimeters: 0.2 },
  output: { tongueThicknessMillimeters: 6, grooveWidthMillimeters: 6.2 },
} satisfies ToolExample<FederNutMasse13RegelInput, FederNutMasse13RegelOutput>;

export const tool = createSimpleTool({
  id: "carpentry/feder-nut-masse-1-3-regel",
  title: "Feder Nut Masse 1 3 Regel",
  description:
    "One-third-rule tongue thickness from stock thickness and groove width after a user-selected fitting clearance.",
  inputs: [
    {
      id: "stockThicknessMillimeters",
      kind: "number",
      label: "Stock Thickness Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fitClearanceMillimeters",
      kind: "number",
      label: "Fit Clearance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tongueThicknessMillimeters",
      kind: "number",
      label: "Tongue Thickness Millimeters",
      unit: "mm",
    },
    {
      id: "grooveWidthMillimeters",
      kind: "number",
      label: "Groove Width Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFederNutMasse13Regel({
      stockThicknessMillimeters: input.stockThicknessMillimeters as number,
      fitClearanceMillimeters: input.fitClearanceMillimeters as number,
    }),
});
export const federNutMasse13RegelTool = tool;
export const runFederNutMasse13Regel = tool.execute;
export default tool;

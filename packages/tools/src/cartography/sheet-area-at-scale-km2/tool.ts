import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SheetAreaAtScaleKm2Input = Readonly<{
  readonly widthCentimeters: number;
  readonly heightCentimeters: number;
  readonly denominator: number;
}>;
export type SheetAreaAtScaleKm2Output = Readonly<{
  readonly groundSquareKilometers: number;
}>;

export const calculateSheetAreaAtScaleKm2 = (
  x: SheetAreaAtScaleKm2Input,
): SheetAreaAtScaleKm2Output => {
  if (!Number.isFinite(x.widthCentimeters) || x.widthCentimeters <= 0)
    simpleError("widthCentimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.heightCentimeters) || x.heightCentimeters <= 0)
    simpleError("heightCentimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.denominator) || x.denominator <= 0)
    simpleError("denominator", "Provide a finite positive number.");
  const groundSquareKilometers =
    (x.widthCentimeters * x.heightCentimeters * x.denominator * x.denominator) /
    1e10;
  if (!Number.isFinite(groundSquareKilometers))
    simpleError(
      "groundSquareKilometers",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    groundSquareKilometers: Object.is(groundSquareKilometers, -0)
      ? 0
      : groundSquareKilometers,
  };
};

export const example = {
  input: {
    widthCentimeters: 40,
    heightCentimeters: 30,
    denominator: 50000,
  },
  output: { groundSquareKilometers: 300 },
} satisfies ToolExample<SheetAreaAtScaleKm2Input, SheetAreaAtScaleKm2Output>;

export const tool = createSimpleTool({
  id: "cartography/sheet-area-at-scale-km2",
  title: "Sheet Area At Scale Km2",
  description:
    "Ground area in square kilometres represented by a map sheet's width and height in centimetres at 1:N scale.",
  inputs: [
    {
      id: "widthCentimeters",
      kind: "number",
      label: "Width Centimeters",
      unit: "cm",
      minimum: 0,
    },
    {
      id: "heightCentimeters",
      kind: "number",
      label: "Height Centimeters",
      unit: "cm",
      minimum: 0,
    },
    { id: "denominator", kind: "number", label: "Denominator", minimum: 0 },
  ],
  outputs: [
    {
      id: "groundSquareKilometers",
      kind: "number",
      label: "Ground Square Kilometers",
      unit: "km2",
    },
  ],
  calculate: (input) =>
    calculateSheetAreaAtScaleKm2({
      widthCentimeters: input.widthCentimeters as number,
      heightCentimeters: input.heightCentimeters as number,
      denominator: input.denominator as number,
    }),
});
export const sheetAreaAtScaleKm2Tool = tool;
export const runSheetAreaAtScaleKm2 = tool.execute;
export default tool;

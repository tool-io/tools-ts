import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnitsPerEmScaleFactorInput = Readonly<{
  readonly fontSizePixels: number;
  readonly unitsPerEm: number;
}>;
export type UnitsPerEmScaleFactorOutput = Readonly<{
  readonly pixelsPerFontUnit: number;
}>;

export const calculateUnitsPerEmScaleFactor = (
  x: UnitsPerEmScaleFactorInput,
): UnitsPerEmScaleFactorOutput => {
  if (!Number.isFinite(x.fontSizePixels) || x.fontSizePixels <= 0)
    simpleError("fontSizePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.unitsPerEm) || x.unitsPerEm <= 0)
    simpleError("unitsPerEm", "Provide a finite positive number.");
  const pixelsPerFontUnit = x.fontSizePixels / x.unitsPerEm;
  if (!Number.isFinite(pixelsPerFontUnit))
    simpleError(
      "pixelsPerFontUnit",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pixelsPerFontUnit: Object.is(pixelsPerFontUnit, -0) ? 0 : pixelsPerFontUnit,
  };
};

export const example = {
  input: {
    fontSizePixels: 16,
    unitsPerEm: 1000,
  },
  output: { pixelsPerFontUnit: 0.016 },
} satisfies ToolExample<
  UnitsPerEmScaleFactorInput,
  UnitsPerEmScaleFactorOutput
>;

export const tool = createSimpleTool({
  id: "typography/units-per-em-scale-factor",
  title: "Units Per Em Scale Factor",
  description:
    "Multiplier that maps font design units to pixels at a requested CSS font size.",
  inputs: [
    {
      id: "fontSizePixels",
      kind: "number",
      label: "Font Size Pixels",
      unit: "px",
      minimum: 0,
    },
    { id: "unitsPerEm", kind: "number", label: "Units Per Em", minimum: 0 },
  ],
  outputs: [
    {
      id: "pixelsPerFontUnit",
      kind: "number",
      label: "Pixels Per Font Unit",
      unit: "px/unit",
    },
  ],
  calculate: (input) =>
    calculateUnitsPerEmScaleFactor({
      fontSizePixels: input.fontSizePixels as number,
      unitsPerEm: input.unitsPerEm as number,
    }),
});
export const unitsPerEmScaleFactorTool = tool;
export const runUnitsPerEmScaleFactor = tool.execute;
export default tool;

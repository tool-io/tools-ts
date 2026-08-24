import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CopperplateShadeClassifierInput = {
  readonly thickStrokeWidthMm: number;
  readonly thinStrokeWidthMm: number;
};

export type CopperplateShadeClassifierOutput = {
  readonly shadeContrastRatio: number;
  readonly shadingClass:
    "monoline" | "moderate_shading" | "full_copperplate_shading";
};

export const calculateCopperplateShadeClassifier = (
  input: CopperplateShadeClassifierInput,
): CopperplateShadeClassifierOutput => {
  if (!(
    Number.isFinite(input.thickStrokeWidthMm) && input.thickStrokeWidthMm > 0
  ))
    return simpleError(
      "thickStrokeWidthMm",
      "Stroke widths must be greater than zero.",
      "invalid_widths",
    );
  if (!(
    Number.isFinite(input.thinStrokeWidthMm) && input.thinStrokeWidthMm > 0
  ))
    return simpleError(
      "thinStrokeWidthMm",
      "Stroke widths must be greater than zero.",
      "invalid_widths",
    );
  if (input.thickStrokeWidthMm < input.thinStrokeWidthMm)
    return simpleError(
      "thickStrokeWidthMm",
      "The thick stroke width cannot be smaller than the thin stroke width.",
      "invalid_width_order",
    );
  const ratio = input.thickStrokeWidthMm / input.thinStrokeWidthMm;
  if (!Number.isFinite(ratio))
    return simpleError(
      "thinStrokeWidthMm",
      "The contrast ratio is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    shadeContrastRatio: ratio,
    shadingClass:
      ratio < 1.5
        ? "monoline"
        : ratio < 3
          ? "moderate_shading"
          : "full_copperplate_shading",
  };
};

export const copperplateShadeClassifierExample = {
  input: { thickStrokeWidthMm: 2.5, thinStrokeWidthMm: 0.5 },
  output: {
    shadeContrastRatio: 5,
    shadingClass: "full_copperplate_shading",
  },
} satisfies ToolExample<
  CopperplateShadeClassifierInput,
  CopperplateShadeClassifierOutput
>;

export const copperplateShadeClassifierTool = createSimpleTool({
  id: "paleography/copperplate-shade-classifier",
  title: "Copperplate Shade Classifier",
  description:
    "Classify round-hand shading under the stated bands on the thick-to-thin stroke-width ratio: below 1.5 monoline, below 3 moderate_shading, and from 3 upward full_copperplate_shading.",
  inputs: [
    {
      description: "Measured width of the heaviest downstroke in millimetres.",
      id: "thickStrokeWidthMm",
      kind: "number",
      label: "Thick stroke",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Measured width of the finest hairline in millimetres.",
      id: "thinStrokeWidthMm",
      kind: "number",
      label: "Thin stroke",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      description: "Thick stroke width divided by thin stroke width.",
      id: "shadeContrastRatio",
      kind: "number",
      label: "Contrast ratio",
    },
    {
      description: "Stated-band shading classification.",
      id: "shadingClass",
      enum: ["monoline", "moderate_shading", "full_copperplate_shading"],
      kind: "string",
      label: "Shading class",
    },
  ],
  calculate: (input) =>
    calculateCopperplateShadeClassifier({
      thickStrokeWidthMm: input.thickStrokeWidthMm as number,
      thinStrokeWidthMm: input.thinStrokeWidthMm as number,
    }),
});

export const runCopperplateShadeClassifier =
  copperplateShadeClassifierTool.execute;
export default copperplateShadeClassifierTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DisplayContrastRatioInput = Readonly<{
  readonly whiteNits: number;
  readonly blackNits: number;
}>;
export type DisplayContrastRatioOutput = Readonly<{
  readonly contrastRatio: number;
}>;

export const calculateDisplayContrastRatio = (
  x: DisplayContrastRatioInput,
): DisplayContrastRatioOutput => {
  if (!Number.isFinite(x.whiteNits) || x.whiteNits < 0)
    simpleError("whiteNits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.blackNits) || x.blackNits < 0)
    simpleError("blackNits", "Provide a finite number at least 0.");
  if (x.whiteNits < x.blackNits)
    simpleError(
      "whiteNits",
      "White luminance cannot be below black luminance.",
    );
  const contrastRatio = x.whiteNits / x.blackNits;
  if (!Number.isFinite(contrastRatio))
    simpleError(
      "contrastRatio",
      "Inputs produce an undefined or non-finite result.",
    );
  return { contrastRatio: Object.is(contrastRatio, -0) ? 0 : contrastRatio };
};

export const example = {
  input: { whiteNits: 500, blackNits: 0.5 },
  output: { contrastRatio: 1000 },
} satisfies ToolExample<DisplayContrastRatioInput, DisplayContrastRatioOutput>;

export const tool = createSimpleTool({
  id: "electronics/display-contrast-ratio",
  title: "Display Contrast Ratio",
  description:
    "On/off display contrast ratio from white and black luminance measured under the same conditions.",
  inputs: [
    {
      id: "whiteNits",
      kind: "number",
      label: "White Nits",
      unit: "cd/m²",
      minimum: 0,
    },
    {
      id: "blackNits",
      kind: "number",
      label: "Black Nits",
      unit: "cd/m²",
      minimum: 0,
    },
  ],
  outputs: [{ id: "contrastRatio", kind: "number", label: "Contrast Ratio" }],
  calculate: (input) =>
    calculateDisplayContrastRatio({
      whiteNits: input.whiteNits as number,
      blackNits: input.blackNits as number,
    }),
});
export const displayContrastRatioTool = tool;
export const runDisplayContrastRatio = tool.execute;
export default tool;

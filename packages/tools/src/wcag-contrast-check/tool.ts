import type { ToolExample } from "../core/example.js";
import { createSimpleTool, simpleError } from "../core/simple.js";
import { runHexToRgb } from "../convert/hex-to-rgb/tool.js";
type Rgb = readonly [number, number, number];
export type WcagContrast = {
  readonly background: string;
  readonly foreground: string;
  readonly passes: {
    readonly aaLarge: boolean;
    readonly aaNormal: boolean;
    readonly aaaLarge: boolean;
    readonly aaaNormal: boolean;
  };
  readonly ratio: number;
};
const parseHex = (hex: string): Rgb | null => {
  const result = runHexToRgb({ hex });
  return result.ok
    ? [
        result.output.red as number,
        result.output.green as number,
        result.output.blue as number,
      ]
    : null;
};
const channel = (value: number) => {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};
export const relativeLuminance = (color: Rgb) =>
  0.2126 * channel(color[0]) +
  0.7152 * channel(color[1]) +
  0.0722 * channel(color[2]);
export const calculateWcagContrast = (
  foreground: string,
  background: string,
): WcagContrast | null => {
  const first = parseHex(foreground),
    second = parseHex(background);
  if (!first || !second) return null;
  const firstLuminance = relativeLuminance(first),
    secondLuminance = relativeLuminance(second),
    ratio = Number(
      (
        (Math.max(firstLuminance, secondLuminance) + 0.05) /
        (Math.min(firstLuminance, secondLuminance) + 0.05)
      ).toFixed(2),
    );
  return {
    background: background.toUpperCase(),
    foreground: foreground.toUpperCase(),
    passes: {
      aaLarge: ratio >= 3,
      aaNormal: ratio >= 4.5,
      aaaLarge: ratio >= 4.5,
      aaaNormal: ratio >= 7,
    },
    ratio,
  };
};
export const wcagContrastExample = {
  input: { background: "#FFFFFF", foreground: "#777777" },
  output: {
    result: {
      background: "#FFFFFF",
      foreground: "#777777",
      passes: {
        aaLarge: true,
        aaNormal: false,
        aaaLarge: false,
        aaaNormal: false,
      },
      ratio: 4.48,
    },
  },
} satisfies ToolExample<
  { readonly background: string; readonly foreground: string },
  { readonly result: WcagContrast }
>;
export const wcagContrastTool = createSimpleTool({
  id: "wcag-contrast-check",
  title: "WCAG Contrast Checker",
  description:
    "Check text and background colors against WCAG AA and AAA contrast thresholds.",
  inputs: [
    {
      format: "color/hex",
      id: "foreground",
      kind: "string",
      label: "Foreground color",
    },
    {
      format: "color/hex",
      id: "background",
      kind: "string",
      label: "Background color",
    },
  ],
  outputs: [
    {
      format: "accessibility/wcag-contrast",
      id: "result",
      kind: "object",
      label: "WCAG contrast result",
    },
  ],
  calculate: (input) => {
    const result = calculateWcagContrast(
      input.foreground as string,
      input.background as string,
    );
    if (!result)
      return simpleError(
        "foreground",
        "Enter three- or six-digit hexadecimal colors.",
      );
    return { result };
  },
});
export const runWcagContrast = wcagContrastTool.execute;
export default wcagContrastTool;

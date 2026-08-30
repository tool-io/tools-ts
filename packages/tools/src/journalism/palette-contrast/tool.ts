import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly foregroundHex: string;
  readonly backgroundHex: string;
  readonly minimumContrastRatio: number;
}>;
export type Output = Readonly<{
  readonly contrastRatio: number;
  readonly meetsMinimum: boolean;
}>;

export const calculate = (input: Input): Output => {
  const luminance = (hex: string) => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex))
      simpleError(
        "foregroundHex",
        "Colors must use six-digit hex notation.",
        "invalid_color",
      );
    const channels = [1, 3, 5]
      .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const a = luminance(input.foregroundHex),
    b = luminance(input.backgroundHex);
  const contrastRatio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return {
    contrastRatio,
    meetsMinimum: contrastRatio >= input.minimumContrastRatio,
  };
};

export const exampleInput = {
  foregroundHex: "#000000",
  backgroundHex: "#ffffff",
  minimumContrastRatio: 7,
} satisfies Input;
export const exampleOutput = {
  contrastRatio: 21,
  meetsMinimum: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      foregroundHex: input.foregroundHex as string,
      backgroundHex: input.backgroundHex as string,
      minimumContrastRatio: input.minimumContrastRatio as number,
    }),
  description:
    "Calculate color contrast and compare it with a supplied minimum.",
  id: "journalism/palette-contrast",
  inputs: [
    { id: "foregroundHex", label: "Foreground color", kind: "string" },
    { id: "backgroundHex", label: "Background color", kind: "string" },
    {
      id: "minimumContrastRatio",
      label: "Minimum contrast ratio",
      kind: "number",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "contrastRatio",
      label: "Contrast ratio",
      kind: "number",
      minimum: 1,
    },
    { id: "meetsMinimum", label: "Meets supplied minimum", kind: "boolean" },
  ],
  title: "Palette Contrast",
});

export const run = tool.execute;
export default tool;

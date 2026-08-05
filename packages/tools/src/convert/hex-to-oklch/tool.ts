import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rgbToOklch } from "../oklch.js";

export type HexToOklchInput = { readonly hex: string };
export type HexToOklchOutput = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};

const round = (value: number, precision: number): number =>
  Number(value.toFixed(precision));

export const convertHexToOklch = (
  input: HexToOklchInput,
): HexToOklchOutput | null => {
  const result = (() => {
    let hex = input.hex.trim().replace(/^#/u, "");
    if (/^[\da-f]{3}$/iu.test(hex))
      hex = [...hex].map((digit) => digit + digit).join("");
    if (!/^[\da-f]{6}$/iu.test(hex)) return null;
    const [red, green, blue] = [0, 2, 4].map((offset) =>
      Number.parseInt(hex.slice(offset, offset + 2), 16),
    );
    return rgbToOklch({ blue: blue!, green: green!, red: red! });
  })();
  return result
    ? {
        chroma: round(result.chroma, 6),
        hue: round(result.hue, 6),
        lightness: round(result.lightness, 6),
      }
    : null;
};

export const hexToOklchExample = {
  input: { hex: "#46465A" },
  output: { chroma: 0.033435, hue: 284.798216, lightness: 40.224337 },
} satisfies ToolExample<HexToOklchInput, HexToOklchOutput>;

export const hexToOklchTool = createSimpleTool({
  id: "convert/hex-to-oklch",
  title: "HEX to OKLCH Converter",
  description: "Convert HEX color values to perceptual OKLCH.",
  inputs: [
    { format: "color/hex", id: "hex", kind: "string", label: "HEX color" },
  ],
  outputs: [
    {
      format: "color/oklch-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      unit: "percent",
    },
    {
      format: "color/oklch-chroma",
      id: "chroma",
      kind: "number",
      label: "Chroma",
    },
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      unit: "degree",
    },
  ],
  calculate: (input) => {
    const result = convertHexToOklch(input as HexToOklchInput);
    if (!result) simpleError("", "Enter a valid color.");
    return result;
  },
});

export const runHexToOklch = hexToOklchTool.execute;
export default hexToOklchTool;

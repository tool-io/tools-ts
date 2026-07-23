import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HexToHslInput = { readonly hex: string };
export type HexToHslOutput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};

export const hexToHslExample = {
  input: { hex: "#46465A" },
  output: { hue: 240, lightness: 31.37, saturation: 12.5 },
} satisfies ToolExample<HexToHslInput, HexToHslOutput>;

const round = (value: number): number => Number(value.toFixed(2));
const parseHex = (input: string): [number, number, number] => {
  let hex = input.trim().replace(/^#/u, "");
  if (/^[\da-f]{3}$/iu.test(hex))
    hex = [...hex].map((digit) => digit + digit).join("");
  if (!/^[\da-f]{6}$/iu.test(hex))
    simpleError("hex", "Enter a three- or six-digit hexadecimal color.");
  return [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  ) as [number, number, number];
};

export const hexToHslTool = createSimpleTool({
  id: "convert/hex-to-hsl",
  title: "HEX to HSL Converter",
  description:
    "Convert a hexadecimal sRGB color to hue, saturation, and lightness.",
  inputs: [
    { format: "color/hex", id: "hex", kind: "string", label: "HEX color" },
  ],
  outputs: [
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      unit: "degree",
    },
    {
      format: "color/hsl-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      unit: "percent",
    },
    {
      format: "color/hsl-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      unit: "percent",
    },
  ],
  calculate: (input) => {
    const [red, green, blue] = parseHex(input.hex as string).map(
      (channel) => channel / 255,
    );
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const chroma = maximum - minimum;
    const lightness = (maximum + minimum) / 2;
    let hue = 0;
    if (chroma !== 0) {
      if (maximum === red) hue = 60 * (((green - blue) / chroma) % 6);
      else if (maximum === green) hue = 60 * ((blue - red) / chroma + 2);
      else hue = 60 * ((red - green) / chroma + 4);
    }
    if (hue < 0) hue += 360;
    const saturation =
      chroma === 0 ? 0 : chroma / (1 - Math.abs(2 * lightness - 1));
    return {
      hue: round(hue),
      lightness: round(lightness * 100),
      saturation: round(saturation * 100),
    };
  },
});

export const runHexToHsl = hexToHslTool.execute;
export default hexToHslTool;

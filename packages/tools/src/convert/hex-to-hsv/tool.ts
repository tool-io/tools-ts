import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HexToHsvInput = { readonly hex: string };
export type HexToHsvOutput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};

export const hexToHsvExample = {
  input: { hex: "#46465A" },
  output: { hue: 240, saturation: 22.22, value: 35.29 },
} satisfies ToolExample<HexToHsvInput, HexToHsvOutput>;

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

export const hexToHsvTool = createSimpleTool({
  id: "convert/hex-to-hsv",
  title: "HEX to HSV Converter",
  description:
    "Convert a hexadecimal sRGB color to hue, saturation, and value.",
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
      format: "color/hsv-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      unit: "percent",
    },
    {
      format: "color/hsv-value",
      id: "value",
      kind: "number",
      label: "Value",
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
    let hue = 0;
    if (chroma !== 0) {
      if (maximum === red) hue = 60 * (((green - blue) / chroma) % 6);
      else if (maximum === green) hue = 60 * ((blue - red) / chroma + 2);
      else hue = 60 * ((red - green) / chroma + 4);
    }
    if (hue < 0) hue += 360;
    const saturation = maximum === 0 ? 0 : chroma / maximum;
    return {
      hue: round(hue),
      saturation: round(saturation * 100),
      value: round(maximum * 100),
    };
  },
});

export const runHexToHsv = hexToHsvTool.execute;
export default hexToHsvTool;

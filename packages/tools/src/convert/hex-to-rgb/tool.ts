import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HexToRgbInput = {
  readonly hex: string;
};

export type HexToRgbOutput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export const hexToRgbExample = {
  input: { hex: "#46465A" },
  output: { blue: 90, green: 70, red: 70 },
} satisfies ToolExample<HexToRgbInput, HexToRgbOutput>;

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

export const hexToRgbTool = createSimpleTool({
  id: "convert/hex-to-rgb",
  title: "HEX to RGB Converter",
  description:
    "Convert a hexadecimal sRGB color to red, green, and blue channels.",
  inputs: [
    {
      description: "A three- or six-digit hexadecimal sRGB color.",
      format: "color/hex",
      id: "hex",
      kind: "string",
      label: "HEX color",
    },
  ],
  outputs: [
    { format: "color/rgb-channel", id: "red", kind: "number", label: "Red" },
    {
      format: "color/rgb-channel",
      id: "green",
      kind: "number",
      label: "Green",
    },
    { format: "color/rgb-channel", id: "blue", kind: "number", label: "Blue" },
  ],
  calculate: (input) => {
    const [red, green, blue] = parseHex(input.hex as string);
    return { blue, green, red };
  },
});

export const runHexToRgb = hexToRgbTool.execute;
export default hexToRgbTool;

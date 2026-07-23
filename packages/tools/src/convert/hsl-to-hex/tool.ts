import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HslToHexInput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};
export type HslToHexOutput = { readonly hex: string };

export const hslToHexExample = {
  input: { hue: 240, lightness: 31.37, saturation: 12.5 },
  output: { hex: "#46465A" },
} satisfies ToolExample<HslToHexInput, HslToHexOutput>;

export const hslToHexTool = createSimpleTool({
  id: "convert/hsl-to-hex",
  title: "HSL to HEX Converter",
  description:
    "Convert hue, saturation, and lightness to a six-digit hexadecimal sRGB color.",
  inputs: [
    {
      format: "color/hue",
      id: "hue",
      kind: "number",
      label: "Hue",
      maximum: 360,
      minimum: 0,
      unit: "degree",
    },
    {
      format: "color/hsl-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      format: "color/hsl-lightness",
      id: "lightness",
      kind: "number",
      label: "Lightness",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
  ],
  outputs: [
    { format: "color/hex", id: "hex", kind: "string", label: "HEX color" },
  ],
  calculate: (input) => {
    const hue = (input.hue as number) % 360;
    const saturation = (input.saturation as number) / 100;
    const lightness = (input.lightness as number) / 100;
    const amplitude = saturation * Math.min(lightness, 1 - lightness);
    const channel = (offset: number): string => {
      const position = (offset + hue / 30) % 12;
      const value =
        lightness -
        amplitude * Math.max(-1, Math.min(position - 3, 9 - position, 1));
      return Math.round(value * 255)
        .toString(16)
        .padStart(2, "0");
    };
    return {
      hex: `#${[channel(0), channel(8), channel(4)].join("").toUpperCase()}`,
    };
  },
});

export const runHslToHex = hslToHexTool.execute;
export default hslToHexTool;

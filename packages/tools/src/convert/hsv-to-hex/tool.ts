import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type HsvToHexInput = {
  readonly hue: number;
  readonly saturation: number;
  readonly value: number;
};
export type HsvToHexOutput = { readonly hex: string };

export const hsvToHexExample = {
  input: { hue: 240, saturation: 22.22, value: 35.29 },
  output: { hex: "#46465A" },
} satisfies ToolExample<HsvToHexInput, HsvToHexOutput>;

export const hsvToHexTool = createSimpleTool({
  id: "convert/hsv-to-hex",
  title: "HSV to HEX Converter",
  description:
    "Convert hue, saturation, and value to a six-digit hexadecimal sRGB color.",
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
      format: "color/hsv-saturation",
      id: "saturation",
      kind: "number",
      label: "Saturation",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      format: "color/hsv-value",
      id: "value",
      kind: "number",
      label: "Value",
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
    const value = (input.value as number) / 100;
    const channel = (offset: number): string => {
      const position = (offset + hue / 60) % 6;
      const result =
        value -
        value * saturation * Math.max(0, Math.min(position, 4 - position, 1));
      return Math.round(result * 255)
        .toString(16)
        .padStart(2, "0");
    };
    return {
      hex: `#${[channel(5), channel(3), channel(1)].join("").toUpperCase()}`,
    };
  },
});

export const runHsvToHex = hsvToHexTool.execute;
export default hsvToHexTool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RgbToHslInput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};
export type RgbToHslOutput = {
  readonly hue: number;
  readonly lightness: number;
  readonly saturation: number;
};

export const rgbToHslExample = {
  input: { blue: 90, green: 70, red: 70 },
  output: { hue: 240, lightness: 31.37, saturation: 12.5 },
} satisfies ToolExample<RgbToHslInput, RgbToHslOutput>;

const round = (value: number): number => Number(value.toFixed(2));
const channelField = (id: "blue" | "green" | "red", label: string) => ({
  format: "color/rgb-channel",
  id,
  kind: "number" as const,
  label,
  maximum: 255,
  minimum: 0,
});

export const rgbToHslTool = createSimpleTool({
  id: "convert/rgb-to-hsl",
  title: "RGB to HSL Converter",
  description:
    "Convert red, green, and blue channels to hue, saturation, and lightness.",
  inputs: [
    channelField("red", "Red"),
    channelField("green", "Green"),
    channelField("blue", "Blue"),
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
    const red = (input.red as number) / 255;
    const green = (input.green as number) / 255;
    const blue = (input.blue as number) / 255;
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

export const runRgbToHsl = rgbToHslTool.execute;
export default rgbToHslTool;

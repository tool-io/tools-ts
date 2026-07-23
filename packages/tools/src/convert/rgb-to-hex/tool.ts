import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RgbToHexInput = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};
export type RgbToHexOutput = { readonly hex: string };

export const rgbToHexExample = {
  input: { blue: 90, green: 70, red: 70 },
  output: { hex: "#46465A" },
} satisfies ToolExample<RgbToHexInput, RgbToHexOutput>;

const channelField = (id: "blue" | "green" | "red", label: string) => ({
  format: "color/rgb-channel",
  id,
  kind: "number" as const,
  label,
  maximum: 255,
  minimum: 0,
});

export const rgbToHexTool = createSimpleTool({
  id: "convert/rgb-to-hex",
  title: "RGB to HEX Converter",
  description:
    "Convert red, green, and blue channels to a six-digit hexadecimal sRGB color.",
  inputs: [
    channelField("red", "Red"),
    channelField("green", "Green"),
    channelField("blue", "Blue"),
  ],
  outputs: [
    { format: "color/hex", id: "hex", kind: "string", label: "HEX color" },
  ],
  calculate: (input) => ({
    hex: `#${[input.red, input.green, input.blue]
      .map((channel) =>
        Math.round(channel as number)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()}`,
  }),
});

export const runRgbToHex = rgbToHexTool.execute;
export default rgbToHexTool;

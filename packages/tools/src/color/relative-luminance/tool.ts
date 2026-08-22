import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const RelativeLuminanceTool = createSimpleTool({
  id: "color/relative-luminance",
  title: "Relative Luminance Calculator",
  description: "Compute WCAG relative luminance from RGB values 0-255.",
  inputs: [
    {
      id: "red",
      label: "Red channel",
      kind: "integer",
      maximum: 255,
      minimum: 0,
    },
    {
      id: "green",
      label: "Green channel",
      kind: "integer",
      maximum: 255,
      minimum: 0,
    },
    {
      id: "blue",
      label: "Blue channel",
      kind: "integer",
      maximum: 255,
      minimum: 0,
    },
  ],
  outputs: [{ id: "luminance", label: "Relative luminance", kind: "number" }],
  calculate: (input) => {
    const lin = (c: number) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return {
      luminance:
        0.2126 * lin(input.red as number) +
        0.7152 * lin(input.green as number) +
        0.0722 * lin(input.blue as number),
    };
  },
});
export default RelativeLuminanceTool;
export const runRelativeLuminance = RelativeLuminanceTool.execute;

export type RelativeLuminanceInput = {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
};

export type RelativeLuminanceOutput = {
  readonly luminance: number;
};

export const relativeLuminanceExample = {
  input: {
    red: 1,
    green: 1,
    blue: 1,
  },
  output: {
    luminance: 0.0003035269835488375,
  },
} satisfies ToolExample<RelativeLuminanceInput, RelativeLuminanceOutput>;

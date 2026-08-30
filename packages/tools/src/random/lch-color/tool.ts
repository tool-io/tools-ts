// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type RandomLchColorInput = Readonly<Record<string, never>>;
export type RandomLchColorOutput = {
  readonly lightness: number;
  readonly chroma: number;
  readonly hue: number;
};

export const calculateRandomLchColor = (
  random: RandomSource = Math.random,
): RandomLchColorOutput | null => {
  const lightnessSample = sampleRandomSource(random);
  if (lightnessSample === null) return null;
  const lightness = 0 + lightnessSample * 100;
  const chromaSample = sampleRandomSource(random);
  if (chromaSample === null) return null;
  const chroma = 0 + chromaSample * 150;
  const hueSample = sampleRandomSource(random);
  if (hueSample === null) return null;
  const hue = 0 + hueSample * 360;
  return { lightness, chroma, hue };
};

export const randomLchColorExample = { input: {} } satisfies ToolExample<RandomLchColorInput, RandomLchColorOutput>;

export const randomLchColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLchColor(context.random ?? Math.random);
    if (output === null) return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Generate a CIELCH D50 tuple with lightness in [0, 100), chroma in [0, 150), and hue in [0, 360) using injected randomness; the tuple is not clipped to a device gamut.",
  id: "random/lch-color",
  inputs: [],
  outputs: [
    {
      id: "lightness",
      kind: "number",
      label: "Lightness",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
    {
      id: "chroma",
      kind: "number",
      label: "Chroma",
      maximum: 150,
      minimum: 0,
    },
    {
      id: "hue",
      kind: "number",
      label: "Hue",
      maximum: 360,
      minimum: 0,
      unit: "degree",
    },
  ],
  title: "Random CIELCH Color Generator",
});

export const runRandomLchColor = randomLchColorTool.execute;
export default randomLchColorTool;

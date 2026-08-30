// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type RandomLabColorInput = Readonly<Record<string, never>>;
export type RandomLabColorOutput = {
  readonly lightness: number;
  readonly a: number;
  readonly b: number;
};

export const calculateRandomLabColor = (
  random: RandomSource = Math.random,
): RandomLabColorOutput | null => {
  const lightnessSample = sampleRandomSource(random);
  if (lightnessSample === null) return null;
  const lightness = 0 + lightnessSample * 100;
  const aSample = sampleRandomSource(random);
  if (aSample === null) return null;
  const a = -128 + aSample * 256;
  const bSample = sampleRandomSource(random);
  if (bSample === null) return null;
  const b = -128 + bSample * 256;
  return { lightness, a, b };
};

export const randomLabColorExample = { input: {} } satisfies ToolExample<RandomLabColorInput, RandomLabColorOutput>;

export const randomLabColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLabColor(context.random ?? Math.random);
    if (output === null) return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Generate a CIELAB D50 tuple with lightness in [0, 100) and a/b axes in [-128, 128) using injected randomness; the tuple is not clipped to a device gamut.",
  id: "random/lab-color",
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
      id: "a",
      kind: "number",
      label: "A",
      maximum: 128,
      minimum: -128,
    },
    {
      id: "b",
      kind: "number",
      label: "B",
      maximum: 128,
      minimum: -128,
    },
  ],
  title: "Random CIELAB Color Generator",
});

export const runRandomLabColor = randomLabColorTool.execute;
export default randomLabColorTool;

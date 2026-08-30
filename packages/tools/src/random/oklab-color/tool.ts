// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type RandomOklabColorInput = Readonly<Record<string, never>>;
export type RandomOklabColorOutput = {
  readonly lightness: number;
  readonly a: number;
  readonly b: number;
};

export const calculateRandomOklabColor = (
  random: RandomSource = Math.random,
): RandomOklabColorOutput | null => {
  const lightnessSample = sampleRandomSource(random);
  if (lightnessSample === null) return null;
  const lightness = 0 + lightnessSample * 1;
  const aSample = sampleRandomSource(random);
  if (aSample === null) return null;
  const a = -0.4 + aSample * 0.8;
  const bSample = sampleRandomSource(random);
  if (bSample === null) return null;
  const b = -0.4 + bSample * 0.8;
  return { lightness, a, b };
};

export const randomOklabColorExample = { input: {} } satisfies ToolExample<RandomOklabColorInput, RandomOklabColorOutput>;

export const randomOklabColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOklabColor(context.random ?? Math.random);
    if (output === null) return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Generate an OKLab tuple with lightness in [0, 1) and a/b axes in [-0.4, 0.4) using injected randomness; the tuple is not clipped to a device gamut.",
  id: "random/oklab-color",
  inputs: [],
  outputs: [
    {
      id: "lightness",
      kind: "number",
      label: "Lightness",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "a",
      kind: "number",
      label: "A",
      maximum: 0.4,
      minimum: -0.4,
    },
    {
      id: "b",
      kind: "number",
      label: "B",
      maximum: 0.4,
      minimum: -0.4,
    },
  ],
  title: "Random OKLab Color Generator",
});

export const runRandomOklabColor = randomOklabColorTool.execute;
export default randomOklabColorTool;

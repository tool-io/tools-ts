// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomHslaColorInput = Readonly<Record<string, never>>;
export type RandomHslaColorOutput = {
  readonly hue: number;
  readonly saturationPercent: number;
  readonly lightnessPercent: number;
  readonly alpha: number;
};

export const randomHslaColorValueCount = 940124160;

export const calculateRandomHslaColor = (
  random: RandomSource = Math.random,
): RandomHslaColorOutput | null => {
  const index = calculateRandomInteger(0, 940124159, random);
  if (index === null) return null;
  const hue = Math.floor(Math.floor(Math.floor(index / 256) / 101) / 101) % 360;
  const saturationPercent = Math.floor(Math.floor(index / 256) / 101) % 101;
  const lightnessPercent = Math.floor(index / 256) % 101;
  const alpha = index % 256;
  return { hue, saturationPercent, lightnessPercent, alpha };
};

export const randomHslaColorExample = { input: {} } satisfies ToolExample<
  RandomHslaColorInput,
  RandomHslaColorOutput
>;

export const randomHslaColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHslaColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from integer HSL tuples plus an 8-bit alpha channel. Uses injected randomness and integer channel values.",
  id: "random/hsla-color",
  inputs: [],
  outputs: [
    {
      id: "hue",
      kind: "integer",
      label: "Hue",
      maximum: 359,
      minimum: 0,
      unit: "deg",
    },
    {
      id: "saturationPercent",
      kind: "integer",
      label: "Saturation",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "lightnessPercent",
      kind: "integer",
      label: "Lightness",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "alpha",
      kind: "integer",
      label: "Alpha",
      maximum: 255,
      minimum: 0,
    },
  ],
  title: "Random HSLA Color Generator",
});

export const runRandomHslaColor = randomHslaColorTool.execute;
export default randomHslaColorTool;

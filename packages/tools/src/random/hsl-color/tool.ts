// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomHslColorInput = Readonly<Record<string, never>>;
export type RandomHslColorOutput = {
  readonly hue: number;
  readonly saturationPercent: number;
  readonly lightnessPercent: number;
};

export const randomHslColorValueCount = 3672360;

export const calculateRandomHslColor = (
  random: RandomSource = Math.random,
): RandomHslColorOutput | null => {
  const index = calculateRandomInteger(0, 3672359, random);
  if (index === null) return null;
  const hue = Math.floor(Math.floor(index / 101) / 101) % 360;
  const saturationPercent = Math.floor(index / 101) % 101;
  const lightnessPercent = index % 101;
  return { hue, saturationPercent, lightnessPercent };
};

export const randomHslColorExample = { input: {} } satisfies ToolExample<
  RandomHslColorInput,
  RandomHslColorOutput
>;

export const randomHslColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHslColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from integer HSL tuples with hue 0\u2013359 degrees and saturation/lightness 0\u2013100 percent. Uses injected randomness and integer channel values.",
  id: "random/hsl-color",
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
  ],
  title: "Random HSL Color Generator",
});

export const runRandomHslColor = randomHslColorTool.execute;
export default randomHslColorTool;

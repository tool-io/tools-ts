// Model source: https://doi.org/10.1145/965139.807361
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomHsvColorInput = Readonly<Record<string, never>>;
export type RandomHsvColorOutput = {
  readonly hue: number;
  readonly saturationPercent: number;
  readonly valuePercent: number;
};

export const randomHsvColorValueCount = 3672360;

export const calculateRandomHsvColor = (
  random: RandomSource = Math.random,
): RandomHsvColorOutput | null => {
  const index = calculateRandomInteger(0, 3672359, random);
  if (index === null) return null;
  const hue = Math.floor(Math.floor(index / 101) / 101) % 360;
  const saturationPercent = Math.floor(index / 101) % 101;
  const valuePercent = index % 101;
  return { hue, saturationPercent, valuePercent };
};

export const randomHsvColorExample = { input: {} } satisfies ToolExample<
  RandomHsvColorInput,
  RandomHsvColorOutput
>;

export const randomHsvColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHsvColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from integer HSV tuples with hue 0\u2013359 degrees and saturation/value 0\u2013100 percent. Uses injected randomness and integer channel values.",
  id: "random/hsv-color",
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
      id: "valuePercent",
      kind: "integer",
      label: "Value",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Random HSV Color Generator",
});

export const runRandomHsvColor = randomHsvColorTool.execute;
export default randomHsvColorTool;

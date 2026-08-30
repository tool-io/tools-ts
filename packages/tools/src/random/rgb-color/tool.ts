// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomRgbColorInput = Readonly<Record<string, never>>;
export type RandomRgbColorOutput = {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
};

export const randomRgbColorValueCount = 16777216;

export const calculateRandomRgbColor = (
  random: RandomSource = Math.random,
): RandomRgbColorOutput | null => {
  const index = calculateRandomInteger(0, 16777215, random);
  if (index === null) return null;
  const red = Math.floor(Math.floor(index / 256) / 256) % 256;
  const green = Math.floor(index / 256) % 256;
  const blue = index % 256;
  return { red, green, blue };
};

export const randomRgbColorExample = { input: {} } satisfies ToolExample<
  RandomRgbColorInput,
  RandomRgbColorOutput
>;

export const randomRgbColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRgbColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from all 24-bit RGB channel tuples. Uses injected randomness and integer channel values.",
  id: "random/rgb-color",
  inputs: [],
  outputs: [
    {
      id: "red",
      kind: "integer",
      label: "Red",
      maximum: 255,
      minimum: 0,
    },
    {
      id: "green",
      kind: "integer",
      label: "Green",
      maximum: 255,
      minimum: 0,
    },
    {
      id: "blue",
      kind: "integer",
      label: "Blue",
      maximum: 255,
      minimum: 0,
    },
  ],
  title: "Random RGB Color Generator",
});

export const runRandomRgbColor = randomRgbColorTool.execute;
export default randomRgbColorTool;

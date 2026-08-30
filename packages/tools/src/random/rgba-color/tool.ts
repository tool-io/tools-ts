// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomRgbaColorInput = Readonly<Record<string, never>>;
export type RandomRgbaColorOutput = {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;
};

export const randomRgbaColorValueCount = 4294967296;

export const calculateRandomRgbaColor = (
  random: RandomSource = Math.random,
): RandomRgbaColorOutput | null => {
  const index = calculateRandomInteger(0, 4294967295, random);
  if (index === null) return null;
  const red = Math.floor(Math.floor(Math.floor(index / 256) / 256) / 256) % 256;
  const green = Math.floor(Math.floor(index / 256) / 256) % 256;
  const blue = Math.floor(index / 256) % 256;
  const alpha = index % 256;
  return { red, green, blue, alpha };
};

export const randomRgbaColorExample = { input: {} } satisfies ToolExample<
  RandomRgbaColorInput,
  RandomRgbaColorOutput
>;

export const randomRgbaColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomRgbaColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from all 32-bit RGBA byte tuples; alpha is an 8-bit channel. Uses injected randomness and integer channel values.",
  id: "random/rgba-color",
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
    {
      id: "alpha",
      kind: "integer",
      label: "Alpha",
      maximum: 255,
      minimum: 0,
    },
  ],
  title: "Random RGBA Color Generator",
});

export const runRandomRgbaColor = randomRgbaColorTool.execute;
export default randomRgbaColorTool;

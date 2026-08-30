// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateRandomInteger } from "../number/tool.js";
import type { RandomSource } from "../number/tool.js";

export type RandomGrayscaleColorInput = Readonly<Record<string, never>>;
export type RandomGrayscaleColorOutput = {
  readonly level: number;
};

export const randomGrayscaleColorValueCount = 256;

export const calculateRandomGrayscaleColor = (
  random: RandomSource = Math.random,
): RandomGrayscaleColorOutput | null => {
  const index = calculateRandomInteger(0, 255, random);
  if (index === null) return null;
  const level = index % 256;
  return { level };
};

export const randomGrayscaleColorExample = { input: {} } satisfies ToolExample<
  RandomGrayscaleColorInput,
  RandomGrayscaleColorOutput
>;

export const randomGrayscaleColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGrayscaleColor(context.random ?? Math.random);
    if (output === null)
      return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Choose uniformly from the 256 8-bit grayscale levels, where 0 is black and 255 is white. Uses injected randomness and integer channel values.",
  id: "random/grayscale-color",
  inputs: [],
  outputs: [
    {
      id: "level",
      kind: "integer",
      label: "Level",
      maximum: 255,
      minimum: 0,
    },
  ],
  title: "Random Grayscale Color Generator",
});

export const runRandomGrayscaleColor = randomGrayscaleColorTool.execute;
export default randomGrayscaleColorTool;

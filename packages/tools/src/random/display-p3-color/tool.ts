// Model source: https://www.w3.org/TR/css-color-4/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { sampleRandomSource, type RandomSource } from "../number/tool.js";

export type RandomDisplayP3ColorInput = Readonly<Record<string, never>>;
export type RandomDisplayP3ColorOutput = {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
};

export const calculateRandomDisplayP3Color = (
  random: RandomSource = Math.random,
): RandomDisplayP3ColorOutput | null => {
  const redSample = sampleRandomSource(random);
  if (redSample === null) return null;
  const red = 0 + redSample * 1;
  const greenSample = sampleRandomSource(random);
  if (greenSample === null) return null;
  const green = 0 + greenSample * 1;
  const blueSample = sampleRandomSource(random);
  if (blueSample === null) return null;
  const blue = 0 + blueSample * 1;
  return { red, green, blue };
};

export const randomDisplayP3ColorExample = { input: {} } satisfies ToolExample<RandomDisplayP3ColorInput, RandomDisplayP3ColorOutput>;

export const randomDisplayP3ColorTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomDisplayP3Color(context.random ?? Math.random);
    if (output === null) return simpleError("", "The random source must return a finite value from 0 up to, but not including, 1.", "invalid_random_source");
    return output;
  },
  description: "Generate a gamma-encoded Display P3 RGB tuple with each channel in [0, 1) using injected randomness.",
  id: "random/display-p3-color",
  inputs: [],
  outputs: [
    {
      id: "red",
      kind: "number",
      label: "Red",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "green",
      kind: "number",
      label: "Green",
      maximum: 1,
      minimum: 0,
    },
    {
      id: "blue",
      kind: "number",
      label: "Blue",
      maximum: 1,
      minimum: 0,
    },
  ],
  title: "Random Display P3 Color Generator",
});

export const runRandomDisplayP3Color = randomDisplayP3ColorTool.execute;
export default randomDisplayP3ColorTool;

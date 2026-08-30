// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGeomanticFigureInput = Readonly<Record<string, never>>;
export type RandomGeomanticFigureOutput = { readonly value: string };

const source = { ranges: [[0x1cee0, 0x1ceef]] } as const;

export const randomGeomanticFigureValueCount = 16;

export const calculateRandomGeomanticFigure = (
  random: RandomSource = Math.random,
): RandomGeomanticFigureOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGeomanticFigureExample = {
  input: {},
} satisfies ToolExample<
  RandomGeomanticFigureInput,
  RandomGeomanticFigureOutput
>;

export const randomGeomanticFigureTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGeomanticFigure(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Geomantic Figure using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/geomantic-figure",
  inputs: [],
  outputs: [
    {
      format: "random/geomantic-figure",
      id: "value",
      kind: "string",
      label: "Random Geomantic Figure",
    },
  ],
  title: "Random Geomantic Figure Generator",
});

export const runRandomGeomanticFigure = randomGeomanticFigureTool.execute;
export default randomGeomanticFigureTool;

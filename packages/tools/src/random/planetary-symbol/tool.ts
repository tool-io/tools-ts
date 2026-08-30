// Repertoire source: https://www.unicode.org/charts/PDF/U2600.pdf
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPlanetarySymbolInput = Readonly<Record<string, never>>;
export type RandomPlanetarySymbolOutput = { readonly value: string };

const source = {
  values: [
    "☉",
    "☽",
    "☾",
    "☿",
    "♀",
    "♁",
    "♂",
    "♃",
    "♄",
    "♅",
    "⛢",
    "♆",
    "⯉",
    "♇",
    "⯓",
    "⯔",
    "⯕",
    "⯖",
  ],
} as const;

export const randomPlanetarySymbolValueCount = 18;

export const calculateRandomPlanetarySymbol = (
  random: RandomSource = Math.random,
): RandomPlanetarySymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPlanetarySymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomPlanetarySymbolInput,
  RandomPlanetarySymbolOutput
>;

export const randomPlanetarySymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPlanetarySymbol(
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
    "Choose one Unicode 18.0 symbol for the Sun, Moon, a major planet, or an alternate Uranus, Neptune, or Pluto form using injected randomness.",
  id: "random/planetary-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/planetary-symbol",
      id: "value",
      kind: "string",
      label: "Random Planetary Symbol",
    },
  ],
  title: "Random Planetary Symbol Generator",
});

export const runRandomPlanetarySymbol = randomPlanetarySymbolTool.execute;
export default randomPlanetarySymbolTool;

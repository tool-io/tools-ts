// Repertoire source: https://www.unicode.org/Public/18.0.0/emoji/emoji-test.txt
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomWeatherSymbolInput = Readonly<Record<string, never>>;
export type RandomWeatherSymbolOutput = { readonly value: string };

const source = {
  values: [
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌙",
    "🌚",
    "🌛",
    "🌜",
    "🌡️",
    "☀️",
    "🌝",
    "🌞",
    "🪐",
    "⭐",
    "🌟",
    "🌠",
    "🌌",
    "☁️",
    "⛅",
    "⛈️",
    "🌤️",
    "🌥️",
    "🌦️",
    "🌧️",
    "🌨️",
    "🌩️",
    "🌪️",
    "🌫️",
    "🌬️",
    "🌀",
    "🌈",
    "🌂",
    "☂️",
    "☔",
    "⛱️",
    "⚡",
    "❄️",
    "☃️",
    "⛄",
    "☄️",
    "🪋",
    "🔥",
    "💧",
    "🌊",
  ],
} as const;

export const randomWeatherSymbolValueCount = 48;

export const calculateRandomWeatherSymbol = (
  random: RandomSource = Math.random,
): RandomWeatherSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomWeatherSymbolExample = {
  input: {},
} satisfies ToolExample<RandomWeatherSymbolInput, RandomWeatherSymbolOutput>;

export const randomWeatherSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomWeatherSymbol(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one symbol from the complete Unicode Emoji 18.0 sky-and-weather subgroup using injected randomness.",
  id: "random/weather-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/weather-symbol",
      id: "value",
      kind: "string",
      label: "Random Weather Symbol",
    },
  ],
  title: "Random Weather Symbol Generator",
});

export const runRandomWeatherSymbol = randomWeatherSymbolTool.execute;
export default randomWeatherSymbolTool;

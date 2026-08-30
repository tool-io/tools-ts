// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAstronomicalSymbolInput = Readonly<Record<string, never>>;
export type RandomAstronomicalSymbolOutput = { readonly value: string };

const source = {
  values: [
    "☄",
    "☉",
    "☊",
    "☋",
    "☌",
    "☍",
    "☽",
    "☾",
    "☿",
    "♀",
    "♁",
    "♂",
    "♃",
    "♄",
    "♅",
    "♆",
    "♇",
    "⚸",
    "⛢",
    "⯉",
    "⯓",
    "⯔",
    "⯕",
    "⯖",
    "⯝",
    "⯟",
    "𜻀",
    "𜻁",
    "𜻂",
    "𜻃",
    "𜻄",
    "𜻅",
    "𜻆",
    "𜻇",
    "𜻈",
    "𜻉",
    "𜻊",
    "𜻋",
    "𜻌",
    "𜻍",
    "𜻎",
    "𜻏",
    "𜻐",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🝶",
  ],
} as const;

export const randomAstronomicalSymbolValueCount = 52;

export const calculateRandomAstronomicalSymbol = (
  random: RandomSource = Math.random,
): RandomAstronomicalSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAstronomicalSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomAstronomicalSymbolInput,
  RandomAstronomicalSymbolOutput
>;

export const randomAstronomicalSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAstronomicalSymbol(
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
    "Choose one astronomy-specific character from a documented Unicode 18.0 repertoire covering planets, lunar phases and points, aspects, eclipses, and named asteroid symbols.",
  id: "random/astronomical-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/astronomical-symbol",
      id: "value",
      kind: "string",
      label: "Random Astronomical Symbol",
    },
  ],
  title: "Random Astronomical Symbol Generator",
});

export const runRandomAstronomicalSymbol = randomAstronomicalSymbolTool.execute;
export default randomAstronomicalSymbolTool;

// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMoonPhaseSymbolInput = Readonly<Record<string, never>>;
export type RandomMoonPhaseSymbolOutput = { readonly value: string };

const source = {
  values: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"],
} as const;

export const randomMoonPhaseSymbolValueCount = 8;

export const calculateRandomMoonPhaseSymbol = (
  random: RandomSource = Math.random,
): RandomMoonPhaseSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMoonPhaseSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomMoonPhaseSymbolInput,
  RandomMoonPhaseSymbolOutput
>;

export const randomMoonPhaseSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMoonPhaseSymbol(
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
    "Choose one of the eight standard moon-phase emoji symbols using injected randomness.",
  id: "random/moon-phase-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/moon-phase-symbol",
      id: "value",
      kind: "string",
      label: "Random Moon Phase Symbol",
    },
  ],
  title: "Random Moon Phase Symbol Generator",
});

export const runRandomMoonPhaseSymbol = randomMoonPhaseSymbolTool.execute;
export default randomMoonPhaseSymbolTool;

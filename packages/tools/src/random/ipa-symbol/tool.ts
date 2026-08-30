// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIpaSymbolInput = Readonly<Record<string, never>>;
export type RandomIpaSymbolOutput = { readonly value: string };

const source = {
  ranges: [
    [0x250, 0x2af],
    [0x1d00, 0x1dbf],
  ],
} as const;

export const randomIpaSymbolValueCount = 288;

export const calculateRandomIpaSymbol = (
  random: RandomSource = Math.random,
): RandomIpaSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIpaSymbolExample = {
  input: {},
} satisfies ToolExample<RandomIpaSymbolInput, RandomIpaSymbolOutput>;

export const randomIpaSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIpaSymbol(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 IPA Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ipa-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/ipa-symbol",
      id: "value",
      kind: "string",
      label: "Random IPA Symbol",
    },
  ],
  title: "Random IPA Symbol Generator",
});

export const runRandomIpaSymbol = randomIpaSymbolTool.execute;
export default randomIpaSymbolTool;

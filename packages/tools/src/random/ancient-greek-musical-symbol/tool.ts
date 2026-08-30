// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAncientGreekMusicalSymbolInput = Readonly<
  Record<string, never>
>;
export type RandomAncientGreekMusicalSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d200, 0x1d245]] } as const;

export const randomAncientGreekMusicalSymbolValueCount = 70;

export const calculateRandomAncientGreekMusicalSymbol = (
  random: RandomSource = Math.random,
): RandomAncientGreekMusicalSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAncientGreekMusicalSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomAncientGreekMusicalSymbolInput,
  RandomAncientGreekMusicalSymbolOutput
>;

export const randomAncientGreekMusicalSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAncientGreekMusicalSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Ancient Greek Musical Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ancient-greek-musical-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/ancient-greek-musical-symbol",
      id: "value",
      kind: "string",
      label: "Random Ancient Greek Musical Symbol",
    },
  ],
  title: "Random Ancient Greek Musical Symbol Generator",
});

export const runRandomAncientGreekMusicalSymbol =
  randomAncientGreekMusicalSymbolTool.execute;
export default randomAncientGreekMusicalSymbolTool;

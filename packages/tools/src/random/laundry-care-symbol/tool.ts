// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomLaundryCareSymbolInput = Readonly<Record<string, never>>;
export type RandomLaundryCareSymbolOutput = { readonly value: string };

const source = {
  values: ["wash", "bleach", "dry", "iron", "professional-care"],
} as const;

export const randomLaundryCareSymbolValueCount = 5;

export const calculateRandomLaundryCareSymbol = (
  random: RandomSource = Math.random,
): RandomLaundryCareSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomLaundryCareSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomLaundryCareSymbolInput,
  RandomLaundryCareSymbolOutput
>;

export const randomLaundryCareSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomLaundryCareSymbol(
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
    "Choose one laundry-care symbol category using injected randomness; the portable result names the category and does not reproduce a licensed care-label artwork.",
  id: "random/laundry-care-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/laundry-care-symbol",
      id: "value",
      kind: "string",
      label: "Random Laundry Care Symbol",
    },
  ],
  title: "Random Laundry Care Symbol Generator",
});

export const runRandomLaundryCareSymbol = randomLaundryCareSymbolTool.execute;
export default randomLaundryCareSymbolTool;

// Repertoire source: https://www.unicode.org/emoji/charts-18.0/full-emoji-list.html
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAccessibilitySymbolInput = Readonly<Record<string, never>>;
export type RandomAccessibilitySymbolOutput = { readonly value: string };

const source = {
  values: ["♿", "🦯", "🦻", "🧏", "🦮", "🦽", "🦼", "🦾", "🦿"],
} as const;

export const randomAccessibilitySymbolValueCount = 9;

export const calculateRandomAccessibilitySymbol = (
  random: RandomSource = Math.random,
): RandomAccessibilitySymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAccessibilitySymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomAccessibilitySymbolInput,
  RandomAccessibilitySymbolOutput
>;

export const randomAccessibilitySymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAccessibilitySymbol(
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
    "Choose one commonly encoded Unicode accessibility or assistive-technology symbol using injected randomness.",
  id: "random/accessibility-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/accessibility-symbol",
      id: "value",
      kind: "string",
      label: "Random Accessibility Symbol",
    },
  ],
  title: "Random Accessibility Symbol Generator",
});

export const runRandomAccessibilitySymbol =
  randomAccessibilitySymbolTool.execute;
export default randomAccessibilitySymbolTool;

// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomElectricalSymbolInput = Readonly<Record<string, never>>;
export type RandomElectricalSymbolOutput = { readonly value: string };

const source = {
  values: ["⏚", "⚡", "⌁", "⎓", "⏦", "⏻", "⏼", "⏽", "🔋", "🔌", "💡"],
} as const;

export const randomElectricalSymbolValueCount = 11;

export const calculateRandomElectricalSymbol = (
  random: RandomSource = Math.random,
): RandomElectricalSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomElectricalSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomElectricalSymbolInput,
  RandomElectricalSymbolOutput
>;

export const randomElectricalSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomElectricalSymbol(
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
    "Choose one commonly encoded Unicode electrical, power-control, battery, plug, or lamp symbol using injected randomness.",
  id: "random/electrical-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/electrical-symbol",
      id: "value",
      kind: "string",
      label: "Random Electrical Symbol",
    },
  ],
  title: "Random Electrical Symbol Generator",
});

export const runRandomElectricalSymbol = randomElectricalSymbolTool.execute;
export default randomElectricalSymbolTool;

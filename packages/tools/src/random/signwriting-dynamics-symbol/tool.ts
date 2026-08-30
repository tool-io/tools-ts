// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingDynamicsSymbolInput = Readonly<
  Record<string, never>
>;
export type RandomSignwritingDynamicsSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d9f5, 0x1d9fe]] } as const;

export const randomSignwritingDynamicsSymbolValueCount = 10;

export const calculateRandomSignwritingDynamicsSymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingDynamicsSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingDynamicsSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingDynamicsSymbolInput,
  RandomSignwritingDynamicsSymbolOutput
>;

export const randomSignwritingDynamicsSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingDynamicsSymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Dynamics Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-dynamics-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-dynamics-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Dynamics Symbol",
    },
  ],
  title: "Random SignWriting Dynamics Symbol Generator",
});

export const runRandomSignwritingDynamicsSymbol =
  randomSignwritingDynamicsSymbolTool.execute;
export default randomSignwritingDynamicsSymbolTool;

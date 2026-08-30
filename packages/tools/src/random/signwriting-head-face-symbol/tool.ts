// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomSignwritingHeadFaceSymbolInput = Readonly<
  Record<string, never>
>;
export type RandomSignwritingHeadFaceSymbolOutput = { readonly value: string };

const source = {
  ranges: [
    [0x1d9ff, 0x1da0c],
    [0x1da14, 0x1da2c],
    [0x1da30, 0x1da34],
    [0x1da3b, 0x1da52],
    [0x1da56, 0x1da58],
  ],
} as const;

export const randomSignwritingHeadFaceSymbolValueCount = 71;

export const calculateRandomSignwritingHeadFaceSymbol = (
  random: RandomSource = Math.random,
): RandomSignwritingHeadFaceSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomSignwritingHeadFaceSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomSignwritingHeadFaceSymbolInput,
  RandomSignwritingHeadFaceSymbolOutput
>;

export const randomSignwritingHeadFaceSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomSignwritingHeadFaceSymbol(
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
    "Choose one assigned graphic Unicode 18.0 SignWriting Head and Face Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/signwriting-head-face-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/signwriting-head-face-symbol",
      id: "value",
      kind: "string",
      label: "Random SignWriting Head and Face Symbol",
    },
  ],
  title: "Random SignWriting Head and Face Symbol Generator",
});

export const runRandomSignwritingHeadFaceSymbol =
  randomSignwritingHeadFaceSymbolTool.execute;
export default randomSignwritingHeadFaceSymbolTool;

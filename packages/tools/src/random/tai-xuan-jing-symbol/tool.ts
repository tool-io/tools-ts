// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTaiXuanJingSymbolInput = Readonly<Record<string, never>>;
export type RandomTaiXuanJingSymbolOutput = { readonly value: string };

const source = { ranges: [[0x1d300, 0x1d356]] } as const;

export const randomTaiXuanJingSymbolValueCount = 87;

export const calculateRandomTaiXuanJingSymbol = (
  random: RandomSource = Math.random,
): RandomTaiXuanJingSymbolOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTaiXuanJingSymbolExample = {
  input: {},
} satisfies ToolExample<
  RandomTaiXuanJingSymbolInput,
  RandomTaiXuanJingSymbolOutput
>;

export const randomTaiXuanJingSymbolTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTaiXuanJingSymbol(
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
    "Choose one assigned graphic Unicode 18.0 Tai Xuan Jing Symbol using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/tai-xuan-jing-symbol",
  inputs: [],
  outputs: [
    {
      format: "random/tai-xuan-jing-symbol",
      id: "value",
      kind: "string",
      label: "Random Tai Xuan Jing Symbol",
    },
  ],
  title: "Random Tai Xuan Jing Symbol Generator",
});

export const runRandomTaiXuanJingSymbol = randomTaiXuanJingSymbolTool.execute;
export default randomTaiXuanJingSymbolTool;

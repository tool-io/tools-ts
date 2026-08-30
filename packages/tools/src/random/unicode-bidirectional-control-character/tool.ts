// Repertoire source: https://www.unicode.org/reports/tr9/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUnicodeBidirectionalControlCharacterInput = Readonly<Record<string, never>>;
export type RandomUnicodeBidirectionalControlCharacterOutput = { readonly value: string };

const source = { values: ["؜", "‎", "‏", "‪", "‫", "‬", "‭", "‮", "⁦", "⁧", "⁨", "⁩"] } as const;

export const randomUnicodeBidirectionalControlCharacterValueCount = 12;

export const calculateRandomUnicodeBidirectionalControlCharacter = (
  random: RandomSource = Math.random,
): RandomUnicodeBidirectionalControlCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUnicodeBidirectionalControlCharacterExample = { input: {} } satisfies ToolExample<
  RandomUnicodeBidirectionalControlCharacterInput,
  RandomUnicodeBidirectionalControlCharacterOutput
>;

export const randomUnicodeBidirectionalControlCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUnicodeBidirectionalControlCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode bidirectional formatting control from ALM, LRM/RLM, embedding, override, pop, or isolate controls using injected randomness.",
  id: "random/unicode-bidirectional-control-character",
  inputs: [],
  outputs: [
    {
      format: "random/unicode-bidirectional-control-character",
      id: "value",
      kind: "string",
      label: "Random Unicode Bidirectional Control Character",
    },
  ],
  title: "Random Unicode Bidirectional Control Character Generator",
});

export const runRandomUnicodeBidirectionalControlCharacter = randomUnicodeBidirectionalControlCharacterTool.execute;
export default randomUnicodeBidirectionalControlCharacterTool;

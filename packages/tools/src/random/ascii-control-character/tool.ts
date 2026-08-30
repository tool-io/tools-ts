// Repertoire source: https://www.rfc-editor.org/rfc/rfc20
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAsciiControlCharacterInput = Readonly<Record<string, never>>;
export type RandomAsciiControlCharacterOutput = { readonly value: string };

const source = { ranges: [[0x0, 0x1f], [0x7f, 0x7f]] } as const;

export const randomAsciiControlCharacterValueCount = 33;

export const calculateRandomAsciiControlCharacter = (
  random: RandomSource = Math.random,
): RandomAsciiControlCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAsciiControlCharacterExample = { input: {} } satisfies ToolExample<
  RandomAsciiControlCharacterInput,
  RandomAsciiControlCharacterOutput
>;

export const randomAsciiControlCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAsciiControlCharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one ASCII control character code point from C0 or DEL using injected randomness; the result can be invisible or affect text processing.",
  id: "random/ascii-control-character",
  inputs: [],
  outputs: [
    {
      format: "random/ascii-control-character",
      id: "value",
      kind: "string",
      label: "Random ASCII Control Character",
    },
  ],
  title: "Random ASCII Control Character Generator",
});

export const runRandomAsciiControlCharacter = randomAsciiControlCharacterTool.execute;
export default randomAsciiControlCharacterTool;

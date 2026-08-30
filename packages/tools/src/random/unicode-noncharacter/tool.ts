// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/core-spec/chapter-23/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomUnicodeNoncharacterInput = Readonly<Record<string, never>>;
export type RandomUnicodeNoncharacterOutput = { readonly value: string };

const source = { ranges: [[0xfdd0, 0xfdef], [0xfffe, 0xffff], [0x1fffe, 0x1ffff], [0x2fffe, 0x2ffff], [0x3fffe, 0x3ffff], [0x4fffe, 0x4ffff], [0x5fffe, 0x5ffff], [0x6fffe, 0x6ffff], [0x7fffe, 0x7ffff], [0x8fffe, 0x8ffff], [0x9fffe, 0x9ffff], [0xafffe, 0xaffff], [0xbfffe, 0xbffff], [0xcfffe, 0xcffff], [0xdfffe, 0xdffff], [0xefffe, 0xeffff], [0xffffe, 0xfffff], [0x10fffe, 0x10ffff]] } as const;

export const randomUnicodeNoncharacterValueCount = 66;

export const calculateRandomUnicodeNoncharacter = (
  random: RandomSource = Math.random,
): RandomUnicodeNoncharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomUnicodeNoncharacterExample = { input: {} } satisfies ToolExample<
  RandomUnicodeNoncharacterInput,
  RandomUnicodeNoncharacterOutput
>;

export const randomUnicodeNoncharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomUnicodeNoncharacter(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one of the 66 Unicode noncharacter code points using injected randomness; noncharacters are valid code points reserved for internal use and are not interchange characters.",
  id: "random/unicode-noncharacter",
  inputs: [],
  outputs: [
    {
      format: "random/unicode-noncharacter",
      id: "value",
      kind: "string",
      label: "Random Unicode Noncharacter",
    },
  ],
  title: "Random Unicode Noncharacter Generator",
});

export const runRandomUnicodeNoncharacter = randomUnicodeNoncharacterTool.execute;
export default randomUnicodeNoncharacterTool;

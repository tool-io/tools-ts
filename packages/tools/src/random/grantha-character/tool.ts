// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomGranthaCharacterInput = Readonly<Record<string, never>>;
export type RandomGranthaCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x951, 0x952],
    [0x964, 0x965],
    [0xbe6, 0xbf3],
    [0x1cd0, 0x1cd0],
    [0x1cd2, 0x1cd3],
    [0x1cf2, 0x1cf4],
    [0x1cf8, 0x1cf9],
    [0x20f0, 0x20f0],
    [0x11300, 0x11303],
    [0x11305, 0x1130c],
    [0x1130f, 0x11310],
    [0x11313, 0x11328],
    [0x1132a, 0x11330],
    [0x11332, 0x11333],
    [0x11335, 0x11339],
    [0x1133b, 0x11344],
    [0x11347, 0x11348],
    [0x1134b, 0x1134d],
    [0x11350, 0x11350],
    [0x11357, 0x11357],
    [0x1135d, 0x11363],
    [0x11366, 0x1136c],
    [0x11370, 0x11374],
    [0x11fd0, 0x11fd1],
    [0x11fd3, 0x11fd3],
  ],
} as const;

export const randomGranthaCharacterValueCount = 116;

export const calculateRandomGranthaCharacter = (
  random: RandomSource = Math.random,
): RandomGranthaCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomGranthaCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomGranthaCharacterInput,
  RandomGranthaCharacterOutput
>;

export const randomGranthaCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomGranthaCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Grantha Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/grantha-character",
  inputs: [],
  outputs: [
    {
      format: "random/grantha-character",
      id: "value",
      kind: "string",
      label: "Random Grantha Character",
    },
  ],
  title: "Random Grantha Character Generator",
});

export const runRandomGranthaCharacter = randomGranthaCharacterTool.execute;
export default randomGranthaCharacterTool;

// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomEthiopicCharacterInput = Readonly<Record<string, never>>;
export type RandomEthiopicCharacterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x30e, 0x30e],
    [0x1200, 0x1248],
    [0x124a, 0x124d],
    [0x1250, 0x1256],
    [0x1258, 0x1258],
    [0x125a, 0x125d],
    [0x1260, 0x1288],
    [0x128a, 0x128d],
    [0x1290, 0x12b0],
    [0x12b2, 0x12b5],
    [0x12b8, 0x12be],
    [0x12c0, 0x12c0],
    [0x12c2, 0x12c5],
    [0x12c8, 0x12d6],
    [0x12d8, 0x1310],
    [0x1312, 0x1315],
    [0x1318, 0x135a],
    [0x135d, 0x137c],
    [0x1380, 0x1399],
    [0x2d80, 0x2d96],
    [0x2da0, 0x2da6],
    [0x2da8, 0x2dae],
    [0x2db0, 0x2db6],
    [0x2db8, 0x2dbe],
    [0x2dc0, 0x2dc6],
    [0x2dc8, 0x2dce],
    [0x2dd0, 0x2dd6],
    [0x2dd8, 0x2dde],
    [0xab01, 0xab06],
    [0xab09, 0xab0e],
    [0xab11, 0xab16],
    [0xab20, 0xab26],
    [0xab28, 0xab2e],
    [0x1e7e0, 0x1e7e6],
    [0x1e7e8, 0x1e7eb],
    [0x1e7ed, 0x1e7ee],
    [0x1e7f0, 0x1e7fe],
  ],
} as const;

export const randomEthiopicCharacterValueCount = 524;

export const calculateRandomEthiopicCharacter = (
  random: RandomSource = Math.random,
): RandomEthiopicCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomEthiopicCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomEthiopicCharacterInput,
  RandomEthiopicCharacterOutput
>;

export const randomEthiopicCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomEthiopicCharacter(
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
    "Choose one assigned graphic Unicode 18.0 Ethiopic Character using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ethiopic-character",
  inputs: [],
  outputs: [
    {
      format: "random/ethiopic-character",
      id: "value",
      kind: "string",
      label: "Random Ethiopic Character",
    },
  ],
  title: "Random Ethiopic Character Generator",
});

export const runRandomEthiopicCharacter = randomEthiopicCharacterTool.execute;
export default randomEthiopicCharacterTool;

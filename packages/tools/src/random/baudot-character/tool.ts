// Repertoire source: https://www.itu.int/rec/T-REC-S.1/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomBaudotCharacterInput = Readonly<Record<string, never>>;
export type RandomBaudotCharacterOutput = { readonly value: string };

const source = {
  values: [
    "00000 — NUL",
    "00001 — E / 3",
    "00010 — line feed",
    "00011 — A / -",
    "00100 — space",
    "00101 — S / apostrophe",
    "00110 — I / 8",
    "00111 — U / 7",
    "01000 — carriage return",
    "01001 — D / WRU",
    "01010 — R / 4",
    "01011 — J / bell",
    "01100 — N / comma",
    "01101 — F / !",
    "01110 — C / :",
    "01111 — K / (",
    "10000 — T / 5",
    "10001 — Z / +",
    "10010 — L / )",
    "10011 — W / 2",
    "10100 — H / #",
    "10101 — Y / 6",
    "10110 — P / 0",
    "10111 — Q / 1",
    "11000 — O / 9",
    "11001 — B / ?",
    "11010 — G / &",
    "11011 — figures shift",
    "11100 — M / .",
    "11101 — X / /",
    "11110 — V / ;",
    "11111 — letters shift",
  ],
} as const;

export const randomBaudotCharacterValueCount = 32;

export const calculateRandomBaudotCharacter = (
  random: RandomSource = Math.random,
): RandomBaudotCharacterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomBaudotCharacterExample = {
  input: {},
} satisfies ToolExample<
  RandomBaudotCharacterInput,
  RandomBaudotCharacterOutput
>;

export const randomBaudotCharacterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomBaudotCharacter(
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
    "Choose one of all 32 five-bit ITA2 code positions using injected randomness; figure-shift punctuation can vary between national implementations.",
  id: "random/baudot-character",
  inputs: [],
  outputs: [
    {
      format: "random/baudot-character",
      id: "value",
      kind: "string",
      label: "Random Baudot Character",
    },
  ],
  title: "Random Baudot Character Generator",
});

export const runRandomBaudotCharacter = randomBaudotCharacterTool.execute;
export default randomBaudotCharacterTool;

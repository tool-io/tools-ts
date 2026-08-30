// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHanifiRohingyaLetterInput = Readonly<Record<string, never>>;
export type RandomHanifiRohingyaLetterOutput = { readonly value: string };

const source = {
  ranges: [
    [0x640, 0x640],
    [0x10d00, 0x10d23],
  ],
} as const;

export const randomHanifiRohingyaLetterValueCount = 37;

export const calculateRandomHanifiRohingyaLetter = (
  random: RandomSource = Math.random,
): RandomHanifiRohingyaLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHanifiRohingyaLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomHanifiRohingyaLetterInput,
  RandomHanifiRohingyaLetterOutput
>;

export const randomHanifiRohingyaLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHanifiRohingyaLetter(
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
    "Choose one assigned Unicode 18.0 Hanifi Rohingya Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/hanifi-rohingya-letter",
  inputs: [],
  outputs: [
    {
      format: "random/hanifi-rohingya-letter",
      id: "value",
      kind: "string",
      label: "Random Hanifi Rohingya Letter",
    },
  ],
  title: "Random Hanifi Rohingya Letter Generator",
});

export const runRandomHanifiRohingyaLetter =
  randomHanifiRohingyaLetterTool.execute;
export default randomHanifiRohingyaLetterTool;

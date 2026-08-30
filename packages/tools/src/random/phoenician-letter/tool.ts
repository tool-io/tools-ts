// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomPhoenicianLetterInput = Readonly<Record<string, never>>;
export type RandomPhoenicianLetterOutput = { readonly value: string };

const source = { ranges: [[0x10900, 0x10915]] } as const;

export const randomPhoenicianLetterValueCount = 22;

export const calculateRandomPhoenicianLetter = (
  random: RandomSource = Math.random,
): RandomPhoenicianLetterOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomPhoenicianLetterExample = {
  input: {},
} satisfies ToolExample<
  RandomPhoenicianLetterInput,
  RandomPhoenicianLetterOutput
>;

export const randomPhoenicianLetterTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomPhoenicianLetter(
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
    "Choose one assigned Unicode 18.0 Phoenician Letter using injected randomness, including letters associated through Script_Extensions.",
  id: "random/phoenician-letter",
  inputs: [],
  outputs: [
    {
      format: "random/phoenician-letter",
      id: "value",
      kind: "string",
      label: "Random Phoenician Letter",
    },
  ],
  title: "Random Phoenician Letter Generator",
});

export const runRandomPhoenicianLetter = randomPhoenicianLetterTool.execute;
export default randomPhoenicianLetterTool;

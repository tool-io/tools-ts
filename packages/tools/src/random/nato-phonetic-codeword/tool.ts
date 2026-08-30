// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomNatoPhoneticCodewordInput = Readonly<Record<string, never>>;
export type RandomNatoPhoneticCodewordOutput = { readonly value: string };

const source = {
  values: [
    "Alfa",
    "Bravo",
    "Charlie",
    "Delta",
    "Echo",
    "Foxtrot",
    "Golf",
    "Hotel",
    "India",
    "Juliett",
    "Kilo",
    "Lima",
    "Mike",
    "November",
    "Oscar",
    "Papa",
    "Quebec",
    "Romeo",
    "Sierra",
    "Tango",
    "Uniform",
    "Victor",
    "Whiskey",
    "X-ray",
    "Yankee",
    "Zulu",
  ],
} as const;

export const randomNatoPhoneticCodewordValueCount = 26;

export const calculateRandomNatoPhoneticCodeword = (
  random: RandomSource = Math.random,
): RandomNatoPhoneticCodewordOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomNatoPhoneticCodewordExample = {
  input: {},
} satisfies ToolExample<
  RandomNatoPhoneticCodewordInput,
  RandomNatoPhoneticCodewordOutput
>;

export const randomNatoPhoneticCodewordTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomNatoPhoneticCodeword(
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
    "Choose one ICAO spelling-alphabet codeword using injected randomness.",
  id: "random/nato-phonetic-codeword",
  inputs: [],
  outputs: [
    {
      format: "random/nato-phonetic-codeword",
      id: "value",
      kind: "string",
      label: "Random NATO Phonetic Codeword",
    },
  ],
  title: "Random NATO Phonetic Codeword Generator",
});

export const runRandomNatoPhoneticCodeword =
  randomNatoPhoneticCodewordTool.execute;
export default randomNatoPhoneticCodewordTool;

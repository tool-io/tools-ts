// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAegeanNumberInput = Readonly<Record<string, never>>;
export type RandomAegeanNumberOutput = { readonly value: string };

const source = { ranges: [[0x10107, 0x10133]] } as const;

export const randomAegeanNumberValueCount = 45;

export const calculateRandomAegeanNumber = (
  random: RandomSource = Math.random,
): RandomAegeanNumberOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAegeanNumberExample = {
  input: {},
} satisfies ToolExample<RandomAegeanNumberInput, RandomAegeanNumberOutput>;

export const randomAegeanNumberTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAegeanNumber(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one assigned graphic Unicode 18.0 Aegean Number using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/aegean-number",
  inputs: [],
  outputs: [
    {
      format: "random/aegean-number",
      id: "value",
      kind: "string",
      label: "Random Aegean Number",
    },
  ],
  title: "Random Aegean Number Generator",
});

export const runRandomAegeanNumber = randomAegeanNumberTool.execute;
export default randomAegeanNumberTool;

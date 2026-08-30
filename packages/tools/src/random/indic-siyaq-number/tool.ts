// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomIndicSiyaqNumberInput = Readonly<Record<string, never>>;
export type RandomIndicSiyaqNumberOutput = { readonly value: string };

const source = { ranges: [[0x1ec71, 0x1ecb4]] } as const;

export const randomIndicSiyaqNumberValueCount = 68;

export const calculateRandomIndicSiyaqNumber = (
  random: RandomSource = Math.random,
): RandomIndicSiyaqNumberOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomIndicSiyaqNumberExample = {
  input: {},
} satisfies ToolExample<
  RandomIndicSiyaqNumberInput,
  RandomIndicSiyaqNumberOutput
>;

export const randomIndicSiyaqNumberTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomIndicSiyaqNumber(
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
    "Choose one assigned graphic Unicode 18.0 Indic Siyaq Number using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/indic-siyaq-number",
  inputs: [],
  outputs: [
    {
      format: "random/indic-siyaq-number",
      id: "value",
      kind: "string",
      label: "Random Indic Siyaq Number",
    },
  ],
  title: "Random Indic Siyaq Number Generator",
});

export const runRandomIndicSiyaqNumber = randomIndicSiyaqNumberTool.execute;
export default randomIndicSiyaqNumberTool;

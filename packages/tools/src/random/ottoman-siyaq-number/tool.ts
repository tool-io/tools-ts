// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomOttomanSiyaqNumberInput = Readonly<Record<string, never>>;
export type RandomOttomanSiyaqNumberOutput = { readonly value: string };

const source = { ranges: [[0x1ed01, 0x1ed3d]] } as const;

export const randomOttomanSiyaqNumberValueCount = 61;

export const calculateRandomOttomanSiyaqNumber = (
  random: RandomSource = Math.random,
): RandomOttomanSiyaqNumberOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomOttomanSiyaqNumberExample = {
  input: {},
} satisfies ToolExample<
  RandomOttomanSiyaqNumberInput,
  RandomOttomanSiyaqNumberOutput
>;

export const randomOttomanSiyaqNumberTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomOttomanSiyaqNumber(
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
    "Choose one assigned graphic Unicode 18.0 Ottoman Siyaq Number using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ottoman-siyaq-number",
  inputs: [],
  outputs: [
    {
      format: "random/ottoman-siyaq-number",
      id: "value",
      kind: "string",
      label: "Random Ottoman Siyaq Number",
    },
  ],
  title: "Random Ottoman Siyaq Number Generator",
});

export const runRandomOttomanSiyaqNumber = randomOttomanSiyaqNumberTool.execute;
export default randomOttomanSiyaqNumberTool;

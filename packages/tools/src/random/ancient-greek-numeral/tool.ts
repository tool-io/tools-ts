// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomAncientGreekNumeralInput = Readonly<Record<string, never>>;
export type RandomAncientGreekNumeralOutput = { readonly value: string };

const source = { ranges: [[0x10140, 0x10174]] } as const;

export const randomAncientGreekNumeralValueCount = 53;

export const calculateRandomAncientGreekNumeral = (
  random: RandomSource = Math.random,
): RandomAncientGreekNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomAncientGreekNumeralExample = {
  input: {},
} satisfies ToolExample<
  RandomAncientGreekNumeralInput,
  RandomAncientGreekNumeralOutput
>;

export const randomAncientGreekNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomAncientGreekNumeral(
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
    "Choose one assigned graphic Unicode 18.0 Ancient Greek Numeral using injected randomness, including letters, combining marks, numbers, punctuation, and symbols associated through Script_Extensions.",
  id: "random/ancient-greek-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/ancient-greek-numeral",
      id: "value",
      kind: "string",
      label: "Random Ancient Greek Numeral",
    },
  ],
  title: "Random Ancient Greek Numeral Generator",
});

export const runRandomAncientGreekNumeral =
  randomAncientGreekNumeralTool.execute;
export default randomAncientGreekNumeralTool;

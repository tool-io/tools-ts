// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomEthiopicNumeralInput = Readonly<Record<string, never>>;
export type RandomEthiopicNumeralOutput = { readonly value: string };

const source = { ranges: [[0x1369, 0x137c]] } as const;

export const randomEthiopicNumeralValueCount = 20;

export const calculateRandomEthiopicNumeral = (
  random: RandomSource = Math.random,
): RandomEthiopicNumeralOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomEthiopicNumeralExample = { input: {} } satisfies ToolExample<
  RandomEthiopicNumeralInput,
  RandomEthiopicNumeralOutput
>;

export const randomEthiopicNumeralTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomEthiopicNumeral(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 ethiopic numeral from its explicitly bounded repertoire using injected randomness.",
  id: "random/ethiopic-numeral",
  inputs: [],
  outputs: [
    {
      format: "random/ethiopic-numeral",
      id: "value",
      kind: "string",
      label: "Random Ethiopic Numeral",
    },
  ],
  title: "Random Ethiopic Numeral Generator",
});

export const runRandomEthiopicNumeral = randomEthiopicNumeralTool.execute;
export default randomEthiopicNumeralTool;

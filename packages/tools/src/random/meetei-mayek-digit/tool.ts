// Repertoire source: https://www.unicode.org/versions/Unicode18.0.0/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMeeteiMayekDigitInput = Readonly<Record<string, never>>;
export type RandomMeeteiMayekDigitOutput = { readonly value: string };

const source = { ranges: [[0xabf0, 0xabf9]] } as const;

export const randomMeeteiMayekDigitValueCount = 10;

export const calculateRandomMeeteiMayekDigit = (
  random: RandomSource = Math.random,
): RandomMeeteiMayekDigitOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMeeteiMayekDigitExample = { input: {} } satisfies ToolExample<
  RandomMeeteiMayekDigitInput,
  RandomMeeteiMayekDigitOutput
>;

export const randomMeeteiMayekDigitTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMeeteiMayekDigit(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one Unicode 18.0 meetei mayek digit from its explicitly bounded repertoire using injected randomness.",
  id: "random/meetei-mayek-digit",
  inputs: [],
  outputs: [
    {
      format: "random/meetei-mayek-digit",
      id: "value",
      kind: "string",
      label: "Random Meetei Mayek Digit",
    },
  ],
  title: "Random Meetei Mayek Digit Generator",
});

export const runRandomMeeteiMayekDigit = randomMeeteiMayekDigitTool.execute;
export default randomMeeteiMayekDigitTool;

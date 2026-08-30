// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomMaritimeSignalFlagInput = Readonly<Record<string, never>>;
export type RandomMaritimeSignalFlagOutput = { readonly value: string };

const source = {
  values: [
    "A — Alfa",
    "B — Bravo",
    "C — Charlie",
    "D — Delta",
    "E — Echo",
    "F — Foxtrot",
    "G — Golf",
    "H — Hotel",
    "I — India",
    "J — Juliett",
    "K — Kilo",
    "L — Lima",
    "M — Mike",
    "N — November",
    "O — Oscar",
    "P — Papa",
    "Q — Quebec",
    "R — Romeo",
    "S — Sierra",
    "T — Tango",
    "U — Uniform",
    "V — Victor",
    "W — Whiskey",
    "X — X-ray",
    "Y — Yankee",
    "Z — Zulu",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "First substitute",
    "Second substitute",
    "Third substitute",
    "Answering pennant",
  ],
} as const;

export const randomMaritimeSignalFlagValueCount = 40;

export const calculateRandomMaritimeSignalFlag = (
  random: RandomSource = Math.random,
): RandomMaritimeSignalFlagOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomMaritimeSignalFlagExample = {
  input: {},
} satisfies ToolExample<
  RandomMaritimeSignalFlagInput,
  RandomMaritimeSignalFlagOutput
>;

export const randomMaritimeSignalFlagTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomMaritimeSignalFlag(
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
    "Choose one International Code of Signals flag identifier using injected randomness; the set includes 26 letter flags, ten numeral pennants, three substitutes, and the answering pennant; the portable result names the flag and does not render its artwork.",
  id: "random/maritime-signal-flag",
  inputs: [],
  outputs: [
    {
      format: "random/maritime-signal-flag",
      id: "value",
      kind: "string",
      label: "Random Maritime Signal Flag",
    },
  ],
  title: "Random Maritime Signal Flag Generator",
});

export const runRandomMaritimeSignalFlag = randomMaritimeSignalFlagTool.execute;
export default randomMaritimeSignalFlagTool;

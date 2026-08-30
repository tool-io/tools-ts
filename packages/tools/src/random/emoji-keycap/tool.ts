// Repertoire source: https://www.unicode.org/reports/tr51/
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomEmojiKeycapInput = Readonly<Record<string, never>>;
export type RandomEmojiKeycapOutput = { readonly value: string };

const source = { values: ["#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"] } as const;

export const randomEmojiKeycapValueCount = 12;

export const calculateRandomEmojiKeycap = (
  random: RandomSource = Math.random,
): RandomEmojiKeycapOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomEmojiKeycapExample = { input: {} } satisfies ToolExample<
  RandomEmojiKeycapInput,
  RandomEmojiKeycapOutput
>;

export const randomEmojiKeycapTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomEmojiKeycap(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description: "Choose one fully qualified Unicode emoji keycap sequence for #, *, or a decimal digit using injected randomness.",
  id: "random/emoji-keycap",
  inputs: [],
  outputs: [
    {
      format: "random/emoji-keycap",
      id: "value",
      kind: "string",
      label: "Random Emoji Keycap",
    },
  ],
  title: "Random Emoji Keycap Generator",
});

export const runRandomEmojiKeycap = randomEmojiKeycapTool.execute;
export default randomEmojiKeycapTool;

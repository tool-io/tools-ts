import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BrailleEncodeInput = {
  readonly text: string;
};

export type BrailleEncodeOutput = {
  readonly braille: string;
};

const LETTERS: Readonly<Record<string, string>> = {
  a: "\u2801",
  b: "\u2803",
  c: "\u2809",
  d: "\u2819",
  e: "\u2811",
  f: "\u280B",
  g: "\u281B",
  h: "\u2813",
  i: "\u280A",
  j: "\u281A",
  k: "\u2805",
  l: "\u2807",
  m: "\u280D",
  n: "\u281D",
  o: "\u2815",
  p: "\u280F",
  q: "\u281F",
  r: "\u2817",
  s: "\u280E",
  t: "\u281E",
  u: "\u2825",
  v: "\u2827",
  w: "\u283A",
  x: "\u282D",
  y: "\u283D",
  z: "\u2835",
};
const NUMBER_SIGN = "\u283C";
const DIGIT_LETTERS = "abcdefghij";

const encodeBrailleWord = (word: string): string =>
  [...word]
    .map((character) => {
      const letter = LETTERS[character];
      if (letter !== undefined) return letter;
      if (/^[0-9]$/.test(character))
        return (
          NUMBER_SIGN + LETTERS[DIGIT_LETTERS[(Number(character) + 9) % 10]!]!
        );
      return simpleError(
        "text",
        `The character "${character}" cannot be encoded.`,
        "unsupported_character",
      );
    })
    .join("");

export const brailleEncodeExample = {
  input: { text: "abc 123" },
  output: {
    braille: "\u2801\u2803\u2809 \u283C\u2801\u283C\u2803\u283C\u2809",
  },
} satisfies ToolExample<BrailleEncodeInput, BrailleEncodeOutput>;

export const brailleEncodeTool = createSimpleTool({
  id: "convert/braille-encode",
  title: "Braille Encoder",
  description:
    "Encode lowercase letters and digits into Unicode Braille patterns, prefixing digits with the number sign.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "braille", kind: "string", label: "Braille" }],
  calculate: (input) => {
    const text = input.text as string;
    if (text.trim() === "")
      simpleError(
        "text",
        "Provide at least one letter or digit.",
        "empty_text",
      );
    const words = text.trim().split(/\s+/);
    return { braille: words.map(encodeBrailleWord).join(" ") };
  },
});
export const runBrailleEncode = brailleEncodeTool.execute;
export default brailleEncodeTool;

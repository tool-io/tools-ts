import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MorseEncodeInput = {
  readonly text: string;
};

export type MorseEncodeOutput = {
  readonly morse: string;
};

const TO_MORSE: Readonly<Record<string, string>> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
};

const encodeMorse = (text: string): string => {
  const words = text.trim().toLowerCase().split(/\s+/);
  return words
    .map((word) =>
      [...word]
        .map((character) => {
          const code = TO_MORSE[character];
          if (code === undefined)
            simpleError(
              "text",
              `The character "${character}" cannot be encoded.`,
              "unsupported_character",
            );
          return code;
        })
        .join(" "),
    )
    .join(" / ");
};

export const morseEncodeExample = {
  input: { text: "hello world" },
  output: { morse: ".... . .-.. .-.. --- / .-- --- .-. .-.. -.." },
} satisfies ToolExample<MorseEncodeInput, MorseEncodeOutput>;

export const calculateMorseEncode = (
  input: MorseEncodeInput,
): MorseEncodeOutput => {
  if (input.text.trim() === "")
    simpleError("text", "Provide at least one letter or digit.", "empty_text");
  return { morse: encodeMorse(input.text) };
};

export const morseEncodeTool = createSimpleTool({
  id: "convert/morse-encode",
  title: "Morse Code Encoder",
  description:
    "Encode ASCII letters and digits into Morse code with words separated by a slash.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "morse", kind: "string", label: "Morse code" }],
  calculate: (input) => calculateMorseEncode({ text: input.text as string }),
});
export const runMorseEncode = morseEncodeTool.execute;
export default morseEncodeTool;

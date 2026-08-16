import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type MorseDirection = "decode" | "encode";

export type MorseCodeInput = {
  readonly direction: MorseDirection;
  readonly text: string;
};

export type MorseCodeOutput = {
  readonly converted: string;
};

/** ITU Morse code; letters and digits only for version 1. */
const LETTERS: Readonly<Record<string, string>> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.",
  g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..",
  m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
  s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-",
  y: "-.--", z: "--..",
};
const DIGITS: Readonly<Record<string, string>> = {
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.",
};
const TO_MORSE: Readonly<Record<string, string>> = {
  ...LETTERS,
  ...DIGITS,
};
const FROM_MORSE: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(TO_MORSE).map(([letter, code]) => [code, letter]),
);

export const morseCodeInputSchema = {
  additionalProperties: false,
  properties: {
    direction: {
      description: "encode turns text into dots and dashes; decode reverses it.",
      enum: ["decode", "encode"],
      type: "string",
    },
    text: {
      description:
        "Plain letters and digits (encode), or dot/dash letter groups separated by spaces with words by slash (decode).",
      maxLength: 100000,
      minLength: 1,
      type: "string",
    },
  },
  required: ["direction", "text"],
  type: "object",
} as const;

export const morseCodeOutputSchema = {
  additionalProperties: false,
  properties: {
    converted: {
      description: "Encoded Morse signal or decoded plain text.",
      minLength: 1,
      type: "string",
    },
  },
  required: ["converted"],
  type: "object",
} as const;

export const morseCodeExample = {
  input: { direction: "encode", text: "sos" },
  output: { converted: "... --- ..." },
} satisfies ToolExample<MorseCodeInput, MorseCodeOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const encodeMorse = (text: string): string | null => {
  const words = text.trim().toLowerCase().split(/\s+/);
  const encodedWords: string[] = [];
  for (const word of words) {
    const letters: string[] = [];
    for (const character of word) {
      const code = TO_MORSE[character];
      if (code === undefined) return null;
      letters.push(code);
    }
    if (letters.length > 0) encodedWords.push(letters.join(" "));
  }
  return encodedWords.length === 0 ? null : encodedWords.join(" / ");
};

const decodeMorse = (text: string): string | null => {
  const words = text.trim().split(/\s*\/\s*/);
  const decodedWords: string[] = [];
  for (const word of words) {
    if (word.trim() === "") return null;
    const characters: string[] = [];
    for (const group of word.trim().split(/\s+/)) {
      const letter = FROM_MORSE[group];
      if (letter === undefined) return null;
      characters.push(letter);
    }
    decodedWords.push(characters.join(""));
  }
  return decodedWords.length === 0 ? null : decodedWords.join(" ");
};

export const isMorseCodeOutput = (value: unknown): value is MorseCodeOutput =>
  isRecord(value) && typeof value.converted === "string";

export const calculateMorseCode = (
  input: unknown,
): ToolResult<MorseCodeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["direction", "text"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const direction = input.direction as MorseDirection | undefined;
  if (direction === undefined)
    return invalidInput([
      ...issues,
      {
        code: "direction_required",
        field: "direction",
        message: "direction is required.",
      },
    ]);
  if (direction !== "encode" && direction !== "decode")
    return invalidInput([
      ...issues,
      {
        code: "direction_invalid",
        field: "direction",
        message: "direction must be encode or decode.",
      },
    ]);

  const rawText = input.text;
  if (rawText === undefined)
    return invalidInput([
      ...issues,
      {
        code: "text_required",
        field: "text",
        message: "text is required.",
      },
    ]);
  if (typeof rawText !== "string" || rawText.trim().length < 1)
    return invalidInput([
      ...issues,
      {
        code: "text_invalid",
        field: "text",
        message: "text must be a non-empty string.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "textCharacters",
    rawText.length,
    "text",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  if (issues.length > 0) return invalidInput(issues);

  const converted =
    direction === "encode"
      ? encodeMorse(rawText)
      : decodeMorse(rawText);
  if (converted === null)
    return invalidInput([
      {
        code: "text_unconvertible",
        field: "text",
        message:
          direction === "encode"
            ? "text must contain only letters and digits."
            : "text must contain only dot, dash, space, and slash groups.",
      },
    ]);
  return toolSuccess({ converted });
};

export const morseCodeTool = defineTool<MorseCodeInput, MorseCodeOutput>({
  contractVersion: 1,
  description:
    "Encode plain letters and digits into ITU Morse code, or decode dots and dashes back to text.",
  discovery: {
    aliases: ["morse-translator", "telegraph-code"],
    keywords: ["dots", "morse", "radio", "telegraph"],
  },
  execute: calculateMorseCode,
  execution: { kind: "pure" },
  id: "convert/morse-code",
  inputSchema: morseCodeInputSchema,
  outputSchema: morseCodeOutputSchema,
  ports: {
    inputs: [
      {
        description: "Text to convert.",
        id: "text",
        label: "Text",
        required: true,
        valueType: { type: "string" },
      },
      {
        description: "Direction of the conversion.",
        id: "direction",
        label: "Direction",
        required: true,
        valueType: { format: "conversion-direction", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Converted text or signal.",
        id: "converted",
        label: "Converted",
        valueType: { type: "string" },
      },
    ],
  },
  title: "Morse Code",
});

export const runMorseCode = morseCodeTool.execute;
export default morseCodeTool;

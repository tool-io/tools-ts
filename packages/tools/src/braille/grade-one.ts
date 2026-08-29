import { simpleError } from "../core/simple.js";

const letters = "abcdefghijklmnopqrstuvwxyz";
const cells = [
  "⠁",
  "⠃",
  "⠉",
  "⠙",
  "⠑",
  "⠋",
  "⠛",
  "⠓",
  "⠊",
  "⠚",
  "⠅",
  "⠇",
  "⠍",
  "⠝",
  "⠕",
  "⠏",
  "⠟",
  "⠗",
  "⠎",
  "⠞",
  "⠥",
  "⠧",
  "⠺",
  "⠭",
  "⠽",
  "⠵",
];
const punctuation: Readonly<Record<string, string>> = {
  ",": "⠂",
  ";": "⠆",
  ":": "⠒",
  ".": "⠲",
  "?": "⠦",
  "!": "⠖",
  "-": "⠤",
  "'": "⠄",
};
const reverseLetters = new Map(cells.map((cell, i) => [cell, letters[i]!]));
const reversePunctuation = new Map(
  Object.entries(punctuation).map(([mark, cell]) => [cell, mark]),
);
const digitLetters = "abcdefghij";
const digitForLetter = (letter: string): string =>
  String((digitLetters.indexOf(letter) + 1) % 10);

export const encodeGradeOneBraille = (text: string): string => {
  if (!text.trim()) simpleError("text", "Enter text to encode.", "empty_text");
  let numeric = false,
    result = "";
  for (const character of text) {
    if (/^[0-9]$/.test(character)) {
      if (!numeric) result += "⠼";
      result +=
        cells[
          digitLetters.indexOf(
            character === "0" ? "j" : digitLetters[Number(character) - 1]!,
          )
        ]!;
      numeric = true;
    } else if (/^[a-zA-Z]$/.test(character)) {
      if (numeric) result += "⠰";
      if (character !== character.toLowerCase()) result += "⠠";
      result += cells[letters.indexOf(character.toLowerCase())]!;
      numeric = false;
    } else if (punctuation[character]) {
      result += punctuation[character];
      numeric = false;
    } else if (character === " " || character === "\n" || character === "\t") {
      result += character;
      numeric = false;
    } else
      simpleError(
        "text",
        `Unsupported character: ${character}`,
        "unsupported_character",
      );
  }
  return result;
};

export const decodeGradeOneBraille = (braille: string): string => {
  if (!braille.trim())
    simpleError("braille", "Enter Braille to decode.", "empty_text");
  let numeric = false,
    capital = false,
    result = "";
  for (const cell of braille) {
    if (cell === "⠼") {
      numeric = true;
      continue;
    }
    if (cell === "⠰") {
      numeric = false;
      continue;
    }
    if (cell === "⠠") {
      capital = true;
      continue;
    }
    const letter = reverseLetters.get(cell);
    if (letter) {
      if (numeric && !digitLetters.includes(letter))
        simpleError(
          "braille",
          "Numeric mode cannot decode this Braille cell as a digit.",
        );
      result += numeric
        ? digitForLetter(letter)
        : capital
          ? letter.toUpperCase()
          : letter;
      capital = false;
    } else if (reversePunctuation.has(cell)) {
      result += reversePunctuation.get(cell)!;
      numeric = false;
      capital = false;
    } else if (cell === " " || cell === "\n" || cell === "\t") {
      result += cell;
      numeric = false;
      capital = false;
    } else
      simpleError(
        "braille",
        `Unsupported Braille cell: ${cell}`,
        "unsupported_cell",
      );
  }
  if (capital) simpleError("braille", "Capital sign has no following letter.");
  return result;
};

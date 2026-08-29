import { simpleError } from "../core/simple.js";

const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
const clean = (value: string): string =>
  value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .replace(/J/g, "I");
const square = (key: string): string => {
  const letters = [...new Set(clean(key) + alphabet)].join("");
  if (letters.length !== 25)
    simpleError("key", "Playfair key must produce a 25-letter square.");
  return letters;
};
const transform = (text: string, key: string, direction: 1 | -1): string => {
  const grid = square(key);
  const cleaned = clean(text);
  const letters: string[] = [];
  if (direction === 1) {
    for (let i = 0; i < cleaned.length;) {
      const a = cleaned[i]!;
      const b = cleaned[i + 1];
      const filler = a === "X" ? "Q" : "X";
      if (!b || a === b) {
        letters.push(a, filler);
        i++;
      } else {
        letters.push(a, b);
        i += 2;
      }
    }
  } else {
    if (cleaned.length % 2)
      simpleError(
        "text",
        "Playfair ciphertext must have an even letter count.",
      );
    letters.push(...cleaned);
  }
  let result = "";
  for (let i = 0; i < letters.length; i += 2) {
    const p = grid.indexOf(letters[i]!),
      q = grid.indexOf(letters[i + 1]!);
    const pr = Math.floor(p / 5),
      pc = p % 5,
      qr = Math.floor(q / 5),
      qc = q % 5;
    if (pr === qr)
      result +=
        grid[pr * 5 + ((pc + direction + 5) % 5)]! +
        grid[qr * 5 + ((qc + direction + 5) % 5)]!;
    else if (pc === qc)
      result +=
        grid[((pr + direction + 5) % 5) * 5 + pc]! +
        grid[((qr + direction + 5) % 5) * 5 + qc]!;
    else result += grid[pr * 5 + qc]! + grid[qr * 5 + pc]!;
  }
  return result;
};
export const playfairEncode = (text: string, key: string): string =>
  transform(text, key, 1);
export const playfairDecode = (text: string, key: string): string =>
  transform(text, key, -1);

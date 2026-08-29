import { simpleError } from "../core/simple.js";

export const vigenere = (
  text: string,
  key: string,
  decode: boolean,
): string => {
  if (!/^[A-Za-z]+$/.test(key))
    simpleError("key", "Key must contain ASCII letters only.");
  const shifts = [...key.toUpperCase()].map((char) => char.charCodeAt(0) - 65);
  let position = 0;
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      const base =
        code >= 65 && code <= 90 ? 65 : code >= 97 && code <= 122 ? 97 : null;
      if (base === null) return char;
      const shift = shifts[position++ % shifts.length]! * (decode ? -1 : 1);
      return String.fromCharCode(base + ((code - base + shift + 26) % 26));
    })
    .join("");
};

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AffineCipherInput = {
  readonly multiplierA: number;
  readonly shiftB: number;
  readonly text: string;
};

export type AffineCipherOutput = {
  readonly encoded: string;
};

export const gcd = (first: number, second: number): number =>
  second === 0 ? first : gcd(second, first % second);

const encodeCharacter = (
  character: string,
  multiplierA: number,
  shiftB: number,
): string => {
  const isUppercase = character >= "A" && character <= "Z";
  if (!isUppercase && !(character >= "a" && character <= "z")) return character;
  const base = isUppercase ? 65 : 97;
  return String.fromCharCode(
    ((multiplierA * (character.charCodeAt(0) - base) + shiftB) % 26) + base,
  );
};

export const encodeAffine = (
  text: string,
  multiplierA: number,
  shiftB: number,
): string =>
  Array.from(text, (character) =>
    encodeCharacter(character, multiplierA, shiftB),
  ).join("");

export const affineCipherExample = {
  input: { multiplierA: 5, shiftB: 8, text: "AFFINE" },
  output: { encoded: "IHHWVC" },
} satisfies ToolExample<AffineCipherInput, AffineCipherOutput>;

export const affineCipherTool = createSimpleTool({
  id: "cryptography/affine-cipher",
  title: "Affine Cipher Encoder",
  description:
    "Encrypt Latin letters with the affine cipher ((a x) + b) mod 26, preserving case and leaving non-letters unchanged.",
  inputs: [
    {
      id: "text",
      kind: "string",
      label: "Text",
    },
    {
      id: "multiplierA",
      kind: "integer",
      label: "Multiplier A",
      maximum: 25,
      minimum: 0,
    },
    {
      id: "shiftB",
      kind: "integer",
      label: "Shift B",
      maximum: 25,
      minimum: 0,
    },
  ],
  outputs: [{ id: "encoded", kind: "string", label: "Encoded text" }],
  calculate: (input) => {
    const multiplierA = input.multiplierA as number;
    const shiftB = input.shiftB as number;
    if (gcd(multiplierA, 26) !== 1)
      simpleError("multiplierA", "must be coprime with 26", "not_coprime");
    return {
      encoded: encodeAffine(input.text as string, multiplierA, shiftB),
    };
  },
});
export const runAffineCipher = affineCipherTool.execute;
export default affineCipherTool;

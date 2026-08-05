import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const rotateCodePoint = (
  codePoint: number,
  base: number,
  rotation: number,
): string =>
  String.fromCharCode(
    base + ((((codePoint - base + rotation) % 26) + 26) % 26),
  );

export const rotateLatinText = (
  text: string,
  rotation: number,
): string | null => {
  if (text === "" || !Number.isSafeInteger(rotation)) return null;
  return Array.from(text, (character) => {
    const codePoint = character.charCodeAt(0);
    if (codePoint >= 65 && codePoint <= 90)
      return rotateCodePoint(codePoint, 65, rotation);
    if (codePoint >= 97 && codePoint <= 122)
      return rotateCodePoint(codePoint, 97, rotation);
    return character;
  }).join("");
};

export const caesarCipherExample = {
  input: { rotation: 3, text: "Tool.io" },
  output: { text: "Wrro.lr" },
} satisfies ToolExample<
  { readonly rotation: number; readonly text: string },
  { readonly text: string }
>;

export const caesarCipherTool = createSimpleTool({
  id: "convert/caesar-cipher",
  title: "Caesar Cipher",
  description:
    "Rotate English letters by a chosen number of alphabet positions while preserving case and other characters.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    { id: "rotation", kind: "integer", label: "Rotation" },
  ],
  outputs: [{ id: "text", kind: "string", label: "Rotated text" }],
  calculate: (input) => {
    const text = rotateLatinText(
      input.text as string,
      input.rotation as number,
    );
    if (text === null)
      simpleError("text", "Enter nonempty text and an integer rotation.");
    return { text };
  },
});

export const runCaesarCipher = caesarCipherTool.execute;
export default caesarCipherTool;

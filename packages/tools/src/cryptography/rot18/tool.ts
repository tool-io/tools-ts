import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Rot18Input = {
  readonly text: string;
};

export type Rot18Output = {
  readonly result: string;
};

const rotateCharacter = (character: string): string => {
  if (character >= "0" && character <= "9")
    return String.fromCharCode(((Number(character) + 5) % 10) + 48);
  const isUppercase = character >= "A" && character <= "Z";
  if (!isUppercase && !(character >= "a" && character <= "z")) return character;
  const base = isUppercase ? 65 : 97;
  return String.fromCharCode(
    ((character.charCodeAt(0) - base + 13) % 26) + base,
  );
};

export const applyRot18 = (text: string): string =>
  text.replace(/[0-9a-zA-Z]/g, rotateCharacter);

export const rot18Example = {
  input: { text: "Hello123" },
  output: { result: "Uryyb678" },
} satisfies ToolExample<Rot18Input, Rot18Output>;

export const rot18Tool = createSimpleTool({
  id: "cryptography/rot18",
  title: "ROT18 Cipher",
  description:
    "Apply ROT13 to letters and ROT5 to digits simultaneously, leaving all other characters unchanged.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "result", kind: "string", label: "ROT18 result" }],
  calculate: (input) => ({
    result: applyRot18(input.text as string),
  }),
});
export const runRot18 = rot18Tool.execute;
export default rot18Tool;

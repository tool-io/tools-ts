import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type AtbashCipherInput = {
  readonly text: string;
};

export type AtbashCipherOutput = {
  readonly result: string;
};

const atbashCharacter = (character: string): string => {
  const code = character.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCharCode(155 - code);
  if (code >= 97 && code <= 122) return String.fromCharCode(219 - code);
  return character;
};

export const atbashCipherExample = {
  input: { text: "Hello World" },
  output: { result: "Svool Dliow" },
} satisfies ToolExample<AtbashCipherInput, AtbashCipherOutput>;

export const calculateAtbashCipher = (
  input: AtbashCipherInput,
): AtbashCipherOutput => ({
  result: [...input.text].map(atbashCharacter).join(""),
});

export const atbashCipherTool = createSimpleTool({
  id: "convert/atbash-cipher",
  title: "Atbash Cipher Encoder",
  description:
    "Apply the reversible Atbash substitution that mirrors A-Z and a-z while leaving other characters unchanged.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "result", kind: "string", label: "Result" }],
  calculate: (input) => calculateAtbashCipher({ text: input.text as string }),
});
export const runAtbashCipher = atbashCipherTool.execute;
export default atbashCipherTool;

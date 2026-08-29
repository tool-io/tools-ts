import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { vigenere } from "../../cipher/vigenere-core.js";

export const example = {
  input: { text: "LXFOPV EF RNHR", key: "LEMON" },
  output: { result: "ATTACK AT DAWN" },
} satisfies ToolExample<
  { readonly text: string; readonly key: string },
  { readonly result: string }
>;
export const tool = createSimpleTool({
  id: "decode/vigenere",
  title: "Vigenère Cipher Decoder",
  description:
    "Decrypt ASCII-letter Vigenère ciphertext with its repeating alphabetic key; case and nonletters are preserved. This is a historical cipher, not modern encryption.",
  inputs: [
    { id: "text", kind: "string", label: "Ciphertext" },
    { id: "key", kind: "string", label: "Alphabetic key" },
  ],
  outputs: [{ id: "result", kind: "string", label: "Plaintext" }],
  calculate: (input) => ({
    result: vigenere(input.text as string, input.key as string, true),
  }),
});
export type VigenereInput = Readonly<typeof example.input>;
export type VigenereOutput = Readonly<typeof example.output>;
export const vigenereTool = tool;
export const runVigenere = tool.execute;
export default tool;

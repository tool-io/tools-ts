import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { vigenere } from "../../cipher/vigenere-core.js";

export const example = {
  input: { text: "ATTACK AT DAWN", key: "LEMON" },
  output: { result: "LXFOPV EF RNHR" },
} satisfies ToolExample<
  { readonly text: string; readonly key: string },
  { readonly result: string }
>;
export const tool = createSimpleTool({
  id: "encode/vigenere",
  title: "Vigenère Cipher Encoder",
  description:
    "Encrypt ASCII letters with the repeating-key Vigenère cipher while preserving case and nonletters. This historical cipher is not secure for private data.",
  inputs: [
    { id: "text", kind: "string", label: "Plaintext" },
    { id: "key", kind: "string", label: "Alphabetic key" },
  ],
  outputs: [{ id: "result", kind: "string", label: "Ciphertext" }],
  calculate: (input) => ({
    result: vigenere(input.text as string, input.key as string, false),
  }),
});
export type VigenereInput = Readonly<typeof example.input>;
export type VigenereOutput = Readonly<typeof example.output>;
export const vigenereTool = tool;
export const runVigenere = tool.execute;
export default tool;

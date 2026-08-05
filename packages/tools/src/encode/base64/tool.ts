import type { ToolExample } from "../../core/example.js";
import { bytesToBase64, utf8Encode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const encodeBase64 = (text: string): string =>
  bytesToBase64(utf8Encode(text));

export const base64EncoderExample = {
  input: { text: "Tool.io" },
  output: { base64: "VG9vbC5pbw==" },
} satisfies ToolExample<{ readonly text: string }, { readonly base64: string }>;

export const base64EncoderTool = createSimpleTool({
  id: "encode/base64",
  title: "Base64 Encoder",
  description: "Encode UTF-8 text as canonical Base64 text.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [
    { format: "base64", id: "base64", kind: "string", label: "Base64" },
  ],
  calculate: (input) => ({ base64: encodeBase64(input.text as string) }),
});

export const runBase64Encoder = base64EncoderTool.execute;
export default base64EncoderTool;

import type { ToolExample } from "../../core/example.js";
import { base64ToBytes, utf8Decode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const decodeBase64 = (base64: string): string =>
  utf8Decode(base64ToBytes(base64, "base64"), "base64");

export const base64DecoderExample = {
  input: { base64: "VG9vbC5pbw==" },
  output: { text: "Tool.io" },
} satisfies ToolExample<{ readonly base64: string }, { readonly text: string }>;

export const base64DecoderTool = createSimpleTool({
  id: "decode/base64",
  title: "Base64 Decoder",
  description: "Decode canonical Base64 into UTF-8 text.",
  inputs: [{ format: "base64", id: "base64", kind: "string", label: "Base64" }],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  calculate: (input) => ({ text: decodeBase64(input.base64 as string) }),
});

export const runBase64Decoder = base64DecoderTool.execute;
export default base64DecoderTool;

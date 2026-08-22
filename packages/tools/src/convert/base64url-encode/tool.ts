import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { bytesToBase64, utf8Encode } from "../../core/encoding.js";

const toBase64Url = (base64: string): string =>
  base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");

export const base64UrlEncodeTool = createSimpleTool({
  id: "convert/base64url-encode",
  title: "Base64URL Encoder",
  description:
    "Encode Unicode text as unpadded, URL-safe Base64 (RFC 4648 §5).",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "base64Url", label: "Base64URL", kind: "string" }],
  calculate: (input) => {
    return {
      base64Url: toBase64Url(bytesToBase64(utf8Encode(input.text as string))),
    };
  },
});
export const runBase64UrlEncode = base64UrlEncodeTool.execute;
export default base64UrlEncodeTool;

export type Base64urlEncodeInput = {
  readonly text: string;
};

export type Base64urlEncodeOutput = {
  readonly base64Url: string;
};

export const base64urlEncodeExample = {
  input: {
    text: "example",
  },
  output: {
    base64Url: "ZXhhbXBsZQ",
  },
} satisfies ToolExample<Base64urlEncodeInput, Base64urlEncodeOutput>;

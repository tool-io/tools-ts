import type { ToolExample } from "../../core/example.js";
import { uuDecode } from "../../core/basen.js";
import { utf8Decode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const decodeUu = (uu: string): string =>
  utf8Decode(uuDecode(uu, "uu"), "uu");

export const uuDecoderExample = {
  input: { uu: "'5&]O;\"YI;P  " },
  output: { text: "Tool.io" },
} satisfies ToolExample<{ readonly uu: string }, { readonly text: string }>;

export const uuDecoderTool = createSimpleTool({
  calculate: (input) => ({ text: decodeUu(input.uu as string) }),
  description:
    "Decode a canonical uuencoded body without begin or end framing lines into UTF-8.",
  id: "decode/uu",
  inputs: [{ format: "uuencode", id: "uu", kind: "string", label: "Uuencoded" }],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  title: "Uudecoder",
});

export const runUuDecoder = uuDecoderTool.execute;
export default uuDecoderTool;

import { base122Codec } from "../../core/basen.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Decode, utf8Encode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const encodeBase122 = (text: string): string =>
  utf8Decode(base122Codec.encode(utf8Encode(text)), "base122");

export const base122EncoderExample = {
  input: { text: "Hello" },
  output: { base122: "$\u0019-Fc<" },
} satisfies ToolExample<
  { readonly text: string },
  { readonly base122: string }
>;

export const base122EncoderTool = createSimpleTool({
  calculate: (input) => ({ base122: encodeBase122(input.text as string) }),
  description:
    "Encode UTF-8 text as Base122 artifact text, avoiding null, newline, carriage return, quote, ampersand, and backslash bytes.",
  id: "encode/base122",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [
    {
      format: "base122",
      id: "base122",
      kind: "string",
      label: "Base122",
    },
  ],
  title: "Base122 Encoder",
});

export const runBase122Encoder = base122EncoderTool.execute;
export default base122EncoderTool;

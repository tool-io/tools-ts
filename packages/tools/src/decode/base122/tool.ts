import { base122Codec } from "../../core/basen.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Decode, utf8Encode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const decodeBase122 = (base122: string): string =>
  utf8Decode(base122Codec.decode(utf8Encode(base122), "base122"), "base122");

export const base122DecoderExample = {
  input: { base122: "*\u001bmva9Ro" },
  output: { text: "Tool.io" },
} satisfies ToolExample<
  { readonly base122: string },
  { readonly text: string }
>;

export const base122DecoderTool = createSimpleTool({
  calculate: (input) => ({ text: decodeBase122(input.base122 as string) }),
  description: "Decode Base122 artifact text into UTF-8.",
  id: "decode/base122",
  inputs: [
    {
      format: "base122",
      id: "base122",
      kind: "string",
      label: "Base122",
    },
  ],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  title: "Base122 Decoder",
});

export const runBase122Decoder = base122DecoderTool.execute;
export default base122DecoderTool;

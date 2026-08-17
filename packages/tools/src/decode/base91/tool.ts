import { base91Codec } from "../../core/basen.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Decode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const decodeBase91 = (base91: string): string =>
  utf8Decode(base91Codec.decode(base91, "base91"), "base91");

export const base91DecoderExample = {
  input: { base91: "Lr.J7g${G" },
  output: { text: "Tool.io" },
} satisfies ToolExample<{ readonly base91: string }, { readonly text: string }>;

export const base91DecoderTool = createSimpleTool({
  calculate: (input) => ({ text: decodeBase91(input.base91 as string) }),
  description: "Decode basE91 text into UTF-8.",
  id: "decode/base91",
  inputs: [
    {
      format: "base91",
      id: "base91",
      kind: "string",
      label: "Base91",
    },
  ],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  title: "Base91 Decoder",
});

export const runBase91Decoder = base91DecoderTool.execute;
export default base91DecoderTool;

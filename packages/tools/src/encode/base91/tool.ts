import { base91Codec } from "../../core/basen.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const encodeBase91 = (text: string): string =>
  base91Codec.encode(utf8Encode(text));

export const base91EncoderExample = {
  input: { text: "Hello World!" },
  output: { base91: ">OwJh>Io0Tv!8PE" },
} satisfies ToolExample<{ readonly text: string }, { readonly base91: string }>;

export const base91EncoderTool = createSimpleTool({
  calculate: (input) => ({ base91: encodeBase91(input.text as string) }),
  description:
    "Encode UTF-8 text as basE91, a compact printable encoding for binary data.",
  id: "encode/base91",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [
    { format: "base91", id: "base91", kind: "string", label: "Base91" },
  ],
  title: "Base91 Encoder",
});

export const runBase91Encoder = base91EncoderTool.execute;
export default base91EncoderTool;

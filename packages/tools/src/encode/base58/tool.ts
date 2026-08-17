import { utf8Encode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { encodeBase58Bytes } from "../../decode/base58/tool.js";

export type Base58EncoderInput = {
  readonly text: string;
};

export type Base58EncoderOutput = {
  readonly encoded: string;
};

export const base58EncoderExample = {
  input: { text: "Hello World!" },
  output: { encoded: "2NEpo7TZRRrLZSi2U" },
} satisfies ToolExample<Base58EncoderInput, Base58EncoderOutput>;

export const calculateBase58Encode = (
  input: Base58EncoderInput,
): Base58EncoderOutput => ({
  encoded: encodeBase58Bytes(utf8Encode(input.text as string)),
});

export const base58EncoderTool = createSimpleTool({
  calculate: (input) =>
    calculateBase58Encode(input as unknown as Base58EncoderInput),
  description:
    "Encode UTF-8 text as Base58 using the Bitcoin alphabet.",
  id: "encode/base58",
  inputs: [
    {
      description: "Text to encode.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Base58 representation.",
      id: "encoded",
      kind: "string",
      label: "Base58",
    },
  ],
  title: "Base58 Encoder",
});
export const runBase58Encoder = base58EncoderTool.execute;
export default base58EncoderTool;

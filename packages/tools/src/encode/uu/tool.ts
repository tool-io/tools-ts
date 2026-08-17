import { uuEncode } from "../../core/basen.js";
import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
import { createSimpleTool } from "../../core/simple.js";

export const encodeUu = (text: string, lineBytes = 45): string =>
  uuEncode(utf8Encode(text), lineBytes);

export const uuEncoderExample = {
  input: {
    text: "Tool.io",
  },
  output: { uu: "'5&]O;\"YI;P  " },
} satisfies ToolExample<
  { readonly lineBytes?: number; readonly text: string },
  { readonly uu: string }
>;

export const uuEncoderTool = createSimpleTool({
  calculate: (input) => ({
    uu: encodeUu(input.text as string, input.lineBytes as number),
  }),
  description:
    "Encode UTF-8 text as a canonical uuencoded body without begin or end framing lines.",
  id: "encode/uu",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    {
      default: 45,
      description: "Payload bytes per output line between 1 and 45.",
      id: "lineBytes",
      kind: "integer",
      label: "Line Bytes",
      maximum: 45,
      minimum: 1,
    },
  ],
  outputs: [{ format: "uuencode", id: "uu", kind: "string", label: "Uuencoded" }],
  title: "Uuencoder",
});

export const runUuEncoder = uuEncoderTool.execute;
export default uuEncoderTool;

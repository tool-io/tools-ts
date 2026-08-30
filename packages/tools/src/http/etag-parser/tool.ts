import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtagParserInput = Readonly<{
  readonly etag: string;
}>;
export type EtagParserOutput = Readonly<{
  readonly weak: boolean;
  readonly opaqueValue: string;
}>;

export const calculateEtagParser = (x: EtagParserInput): EtagParserOutput => {
  if (typeof x.etag !== "string") simpleError("etag", "Provide a string.");
  const match = /^(W\/)?"([\x21\x23-\x7E\x80-\xFF]*)"$/.exec(x.etag);
  if (!match)
    return simpleError("etag", "Expected one quoted HTTP entity tag.");
  return { weak: match[1] !== undefined, opaqueValue: match[2] };
};

export const example = {
  input: { etag: 'W/"revision-7"' },
  output: { weak: true, opaqueValue: "revision-7" },
} satisfies ToolExample<EtagParserInput, EtagParserOutput>;

export const tool = createSimpleTool({
  id: "http/etag-parser",
  title: "HTTP ETag Parser",
  description:
    "Parse one HTTP entity tag into its weak/strong flag and opaque value; rejects lists and unquoted values.",
  inputs: [{ id: "etag", kind: "string", label: "ETag field value" }],
  outputs: [
    { id: "weak", kind: "boolean", label: "Weak validator" },
    { id: "opaqueValue", kind: "string", label: "Opaque tag value" },
  ],
  calculate: (input) =>
    calculateEtagParser({
      etag: input.etag as string,
    }),
});
export const etagParserTool = tool;
export const runEtagParser = tool.execute;
export default tool;

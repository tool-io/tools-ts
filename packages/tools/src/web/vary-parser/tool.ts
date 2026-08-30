import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaryParserInput = Readonly<{
  readonly header: string;
}>;
export type VaryParserOutput = Readonly<{
  readonly fieldNames: readonly string[];
  readonly wildcard: boolean;
}>;

export const calculateVaryParser = (x: VaryParserInput): VaryParserOutput => {
  if (typeof x.header !== "string") simpleError("header", "Provide a string.");
  const parts = x.header.split(",").map((s) => s.trim().toLowerCase());
  if (parts.length === 1 && parts[0] === "*")
    return { fieldNames: [], wildcard: true };
  if (parts.some((s) => s === "*" || !/^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(s)))
    simpleError("header", "Expected field-name tokens or a lone wildcard.");
  return { fieldNames: [...new Set(parts)], wildcard: false };
};

export const example = {
  input: { header: "Accept-Encoding, User-Agent" },
  output: { fieldNames: ["accept-encoding", "user-agent"], wildcard: false },
} satisfies ToolExample<VaryParserInput, VaryParserOutput>;

export const tool = createSimpleTool({
  id: "web/vary-parser",
  title: "Vary Parser",
  description:
    "Parse a Vary response header as a case-insensitive set of field names or the single wildcard value.",
  inputs: [{ id: "header", kind: "string", label: "Vary header" }],
  outputs: [
    { id: "fieldNames", kind: "stringList", label: "Vary field names" },
    { id: "wildcard", kind: "boolean", label: "Wildcard Vary" },
  ],
  calculate: (input) =>
    calculateVaryParser({
      header: input.header as string,
    }),
});
export const varyParserTool = tool;
export const runVaryParser = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransferEncodingParserInput = Readonly<{
  readonly header: string;
}>;
export type TransferEncodingParserOutput = Readonly<{
  readonly codings: readonly string[];
}>;

export const calculateTransferEncodingParser = (
  x: TransferEncodingParserInput,
): TransferEncodingParserOutput => {
  if (typeof x.header !== "string") simpleError("header", "Provide a string.");
  const codings = x.header.split(",").map((s) => s.trim().toLowerCase());
  if (codings.some((s) => !/^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(s)))
    simpleError("header", "Expected nonempty comma-separated coding tokens.");
  return { codings };
};

export const example = {
  input: { header: "gzip, chunked" },
  output: { codings: ["gzip", "chunked"] },
} satisfies ToolExample<
  TransferEncodingParserInput,
  TransferEncodingParserOutput
>;

export const tool = createSimpleTool({
  id: "web/transfer-encoding-parser",
  title: "Transfer Encoding Parser",
  description:
    "Parse a simple comma-separated Transfer-Encoding coding list into lowercase HTTP tokens; extension parameters are outside this tool's scope.",
  inputs: [{ id: "header", kind: "string", label: "Transfer-Encoding header" }],
  outputs: [{ id: "codings", kind: "stringList", label: "Transfer codings" }],
  calculate: (input) =>
    calculateTransferEncodingParser({
      header: input.header as string,
    }),
});
export const transferEncodingParserTool = tool;
export const runTransferEncodingParser = tool.execute;
export default tool;

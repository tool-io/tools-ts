import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RangeParserInput = Readonly<{
  readonly rangeHeader: string;
}>;
export type RangeParserOutput = Readonly<{
  readonly range: Readonly<Record<string, unknown>>;
}>;

export const calculateRangeParser = (
  x: RangeParserInput,
): RangeParserOutput => {
  if (typeof x.rangeHeader !== "string")
    simpleError("rangeHeader", "Provide a string.");
  const match = /^bytes=(\d+)-(\d*)$|^bytes=-(\d+)$/.exec(x.rangeHeader);
  if (!match)
    return simpleError(
      "rangeHeader",
      "Expected one bytes range such as bytes=0-99 or bytes=-500.",
    );
  if (match[3] !== undefined) {
    const length = Number(match[3]);
    if (!Number.isSafeInteger(length))
      simpleError(
        "rangeHeader",
        "Suffix length must be a nonnegative safe integer.",
      );
    return { range: { kind: "suffix", length } };
  }
  const start = Number(match[1]);
  if (!Number.isSafeInteger(start))
    simpleError("rangeHeader", "Range start exceeds safe integer range.");
  if (match[2] === "") return { range: { kind: "open", start } };
  const end = Number(match[2]);
  if (!Number.isSafeInteger(end) || end < start)
    simpleError(
      "rangeHeader",
      "Range end must be a safe integer at least the start.",
    );
  return { range: { kind: "closed", start, end } };
};

export const example = {
  input: { rangeHeader: "bytes=100-199" },
  output: { range: { kind: "closed", start: 100, end: 199 } },
} satisfies ToolExample<RangeParserInput, RangeParserOutput>;

export const tool = createSimpleTool({
  id: "http/range-parser",
  title: "HTTP Range Parser",
  description:
    "Parse exactly one RFC byte-range specifier, preserving closed, open-ended, and suffix forms without resolving it against resource length.",
  inputs: [{ id: "rangeHeader", kind: "string", label: "Range header" }],
  outputs: [{ id: "range", kind: "object", label: "Single byte range" }],
  calculate: (input) =>
    calculateRangeParser({
      rangeHeader: input.rangeHeader as string,
    }),
});
export const rangeParserTool = tool;
export const runRangeParser = tool.execute;
export default tool;

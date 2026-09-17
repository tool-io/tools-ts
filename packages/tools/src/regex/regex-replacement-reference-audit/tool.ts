import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  replacement: string;
  captureCount: number;
  names: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "replacement", kind: "string", label: "replacement" },
  { id: "captureCount", kind: "integer", label: "captureCount" },
  { id: "names", kind: "stringList", label: "names" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.captureCount, 0, 99);
  const tokens = H.replacementTokens(i.replacement),
    issues = tokens.flatMap((t) => {
      if (t.type === "named")
        return i.names.includes(t.text.slice(2, -1)) ? [] : [t];
      if (t.type !== "numbered") return [];
      const n = Number(t.text.slice(1));
      return n > 0 &&
        (n <= i.captureCount ||
          (t.text.length === 3 &&
            Number(t.text[1]) > 0 &&
            Number(t.text[1]) <= i.captureCount))
        ? []
        : [t];
    });
  return H.finish({ issues });
};
export const example = {
  input: { replacement: "$1 $2 $<x>", captureCount: 1, names: [] },
  output: {
    result: {
      issues: [
        { type: "numbered", text: "$2", position: 3 },
        { type: "named", text: "$<x>", position: 6 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-replacement-reference-audit",
  title: "Regex Replacement Reference Audit",
  description:
    "Audit replacement references against an explicit capture count/name bank, accounting for two-digit-to-one-digit fallback; unresolved references remain literal in ECMAScript, not execution errors.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

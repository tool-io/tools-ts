import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  escapePointer,
  pointerTokens,
} from "../batch53-shared.js";
import type { Json } from "../batch53-shared.js";

export type Input = Readonly<{
  documentJson: string;
  paths: readonly string[];
  replacementJson: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
  { id: "paths", label: "Paths", kind: "stringList" },
  { id: "replacementJson", label: "Replacement json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.paths.forEach(pointerTokens);
  const root = parseJson(i.documentJson),
    replacement = parseJson(i.replacementJson),
    wanted = new Set(i.paths),
    changed: string[] = [];
  const walk = (v: Json, p: string): Json => {
    if (v === null || typeof v !== "object") {
      if (wanted.has(p)) {
        changed.push(p);
        return replacement;
      }
      return v;
    }
    if (Array.isArray(v)) return v.map((x, j) => walk(x, p + "/" + j));
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [
        k,
        walk(x, p + "/" + escapePointer(k)),
      ]),
    );
  };
  return {
    document: walk(root, ""),
    changedPaths: changed,
    unmatchedPaths: i.paths.filter((p) => !changed.includes(p)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    documentJson: '{"a":1,"b":2}',
    paths: ["/a"],
    replacementJson: '"REDACTED"',
  },
  output: {
    result: {
      document: { a: "REDACTED", b: 2 },
      changedPaths: ["/a"],
      unmatchedPaths: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-leaf-value-redaction",
  title: "JSON Leaf Value Redaction Tool",
  description:
    "Replace only specified scalar-leaf pointer paths in one pass; unmatched or container paths are reported rather than blindly deleted.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

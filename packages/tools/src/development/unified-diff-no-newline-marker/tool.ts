import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ marker: string; previousLine: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "marker", label: "Marker", kind: "string" },
  { id: "previousLine", label: "Previous line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    /^[ +\-]/.test(i.previousLine) && !/[\r\n]/.test(i.previousLine + i.marker),
  );
  return H.finish({
    recognized: i.marker === "\\ No newline at end of file",
    qualifiedSide: i.previousLine.startsWith("-")
      ? "old"
      : i.previousLine.startsWith("+")
        ? "new"
        : "both",
  });
};
export const example = {
  input: { marker: "\\ No newline at end of file", previousLine: "-abc" },
  output: { result: { recognized: true, qualifiedSide: "old" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/unified-diff-no-newline-marker",
  title: "Development: Unified Diff No Newline Marker Tool",
  description:
    "Recognize the exact unified-diff no-final-newline marker and identify the side of its supplied preceding hunk line; no complete diff parsing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          qualifiedSide: { type: "string" },
          recognized: { type: "boolean" },
        },
        required: ["qualifiedSide", "recognized"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

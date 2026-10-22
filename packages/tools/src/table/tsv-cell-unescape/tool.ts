import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ cell: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cell", kind: "string", label: "cell" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ cell: H.splitEscaped(i.cell, "|").join("|") });
};
export const example = {
  input: { cell: "a\\tb" },
  output: { result: { cell: "a\tb" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/tsv-cell-unescape",
  title: "TSV Cell Unescape Tool",
  description:
    "Backslash unescape for TSV cells using \\t, \\n, \\r and \\\\; this is an explicit dialect, not quoted CSV.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { cell: { type: "string" } },
        required: ["cell"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

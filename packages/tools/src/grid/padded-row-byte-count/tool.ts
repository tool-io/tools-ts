import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{ rowBytes: number; alignmentBytes: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rowBytes", label: "Row bytes", kind: "number" },
  { id: "alignmentBytes", label: "Alignment bytes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.rowBytes, "row", 0, 1e12);
  bounded(i.alignmentBytes, "alignment", 1, 1e9);
  const paddingBytes = mod(-i.rowBytes, i.alignmentBytes);
  return { paddingBytes, paddedBytes: i.rowBytes + paddingBytes };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { rowBytes: 13, alignmentBytes: 4 },
  output: { result: { paddingBytes: 3, paddedBytes: 16 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "grid/padded-row-byte-count",
  title: "Padded Row Byte Count",
  description:
    "Plan row byte alignment padding using arbitrary positive integer alignment, not only powers of two.",
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

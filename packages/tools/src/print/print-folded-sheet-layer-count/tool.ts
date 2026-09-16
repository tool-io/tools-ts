import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ folds: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "folds", kind: "integer", label: "folds" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.folds, 0, 40);
  return H.finish({ layers: 2 ** i.folds });
};
export const example = {
  input: { folds: 3 },
  output: { result: { layers: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "print/print-folded-sheet-layer-count",
  title: "Print Folded Sheet Layer Count",
  description:
    "Count ideal complete doubling folds as sheet layers; this does not predict feasible folds or material behavior.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

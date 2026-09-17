import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ permutation: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const n = i.permutation.length,
    invalid = i.permutation.flatMap((x, j) =>
      !Number.isSafeInteger(x) || x < 0 || x >= n ? [j] : [],
    ),
    duplicates = H.duplicates(i.permutation, String);
  return H.finish({
    valid: !invalid.length && !duplicates.length,
    invalid,
    duplicates,
    missing: Array.from({ length: n }, (_, j) => j).filter(
      (j) => !i.permutation.includes(j),
    ),
  });
};
export const example = {
  input: { permutation: [0, 0, 3] },
  output: {
    result: {
      valid: false,
      invalid: [2],
      duplicates: [{ key: "0", indexes: [0, 1] }],
      missing: [1, 2],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/index-permutation-validator",
  title: "Index Permutation Validator",
  description:
    "Audit a proposed zero-based index permutation with invalid positions, duplicates and missing indexes; malformed evidence is reported rather than accepted.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

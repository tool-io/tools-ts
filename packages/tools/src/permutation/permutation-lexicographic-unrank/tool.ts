import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ size: number; rank: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "size", kind: "integer", label: "size" },
  { id: "rank", kind: "string", label: "rank" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ permutation: H.permUnrank(i.size, H.bigint(i.rank)) });
};
export const example = {
  input: { size: 3, rank: "4" },
  output: { result: { permutation: [2, 0, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "permutation/permutation-lexicographic-unrank",
  title: "Permutation Lexicographic Unrank",
  description:
    "Unrank a zero-based lexicographic index permutation from exact integer text and an explicit bounded size.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

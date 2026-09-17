import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; position: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "position", kind: "integer", label: "position" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.position, 0, i.bits.length);
  const positions = i.bits
    .split("")
    .flatMap((x, j) => (x === "1" && j >= i.position ? [j] : []));
  return H.finish({ position: positions[0] ?? null });
};
export const example = {
  input: { bits: "10100", position: 2 },
  output: { result: { position: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-next-set-position",
  title: "Bit String Next Set Position",
  description:
    "Find the first set bit at or after an explicit position; null preserves absence instead of inventing an index.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

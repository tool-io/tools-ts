import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ checksum: string; bits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "checksum", kind: "string", label: "checksum" },
  { id: "bits", kind: "integer", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  const v = H.bigint(i.checksum);
  H.check(v >= 0n && v < 1n << BigInt(i.bits));
  return H.finish({ hex: v.toString(16).padStart(Math.ceil(i.bits / 4), "0") });
};
export const example = {
  input: { checksum: "10", bits: 12 },
  output: { result: { hex: "00a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-hex-width-formatter",
  title: "Checksum Hex Width Formatter",
  description:
    "Format an exact unsigned checksum as lowercase hex at explicit bit width, enforcing non-nibble-aligned high-bit limits.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

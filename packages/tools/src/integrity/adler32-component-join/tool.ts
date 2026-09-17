import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ low: number; high: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "low", kind: "integer", label: "low" },
  { id: "high", kind: "integer", label: "high" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.low, 0, 65535);
  H.int(i.high, 0, 65535);
  return H.finish({ value: i.high * 65536 + i.low });
};
export const example = {
  input: { low: 1, high: 2 },
  output: { result: { value: 131073 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/adler32-component-join",
  title: "Adler32 Component Joiner",
  description:
    "Split or join packed Adler-32 16-bit checksum components by numeric lanes; does not recompute or verify checksum residues.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; occurrence: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "occurrence", kind: "integer", label: "occurrence" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.occurrence, 0, 128);
  const positions = i.bits.split("").flatMap((x, j) => (x === "1" ? [j] : []));
  return H.finish({ position: positions[i.occurrence] ?? null });
};
export const example = {
  input: { bits: "10100", occurrence: 1 },
  output: { result: { position: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-select-one-query",
  title: "Bit String Select One Query",
  description:
    "Select a zero-based occurrence of bit 1 in an explicit bit string; null denotes an occurrence beyond the observed count.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

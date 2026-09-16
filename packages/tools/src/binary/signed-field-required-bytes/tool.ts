import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", kind: "string", label: "value" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const v = H.bigint(i.value);
  let bytes = 1;
  while (v < -(1n << BigInt(bytes * 8 - 1)) || v >= 1n << BigInt(bytes * 8 - 1))
    bytes++;
  return H.finish({ bytes });
};
export const example = {
  input: { value: "-129" },
  output: { result: { bytes: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/signed-field-required-bytes",
  title: "Signed Field Required Bytes",
  description:
    "Minimum nonempty byte width for an exact decimal integer in signed two\u2019s-complement representation, returned without floating-point conversion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

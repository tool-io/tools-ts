import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ integer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", kind: "string", label: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ address: H.ipText(H.bigint(i.integer), 128) });
};
export const example = {
  input: { integer: "1" },
  output: { result: { address: "0000:0000:0000:0000:0000:0000:0000:0001" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "network/integer-string-ipv6-address",
  title: "Integer String IPv6 Address",
  description:
    "Format an exact unsigned 128-bit decimal integer as fully expanded lowercase IPv6 using the existing group formatter.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

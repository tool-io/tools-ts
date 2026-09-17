import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  sign: number;
  exponent: number;
  fraction: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sign", label: "sign", kind: "integer" },
  { id: "exponent", label: "exponent", kind: "integer" },
  { id: "fraction", label: "fraction", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.sign, 0, 1);
  H.int(i.exponent, 0, 255);
  const fraction = H.bigint(i.fraction);
  H.check(fraction >= 0n && fraction < 1n << 23n);
  return H.finish({
    pattern: String(
      (BigInt(i.sign) << 31n) | (BigInt(i.exponent) << 23n) | fraction,
    ),
  });
};
export const example = {
  input: { sign: 0, exponent: 127, fraction: "0" },
  output: { result: { pattern: "1065353216" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary32-field-join",
  title: "IEEE Binary32 Field Joiner",
  description:
    "Join explicit IEEE binary32 sign/exponent/fraction fields into exact raw integer pattern text; permits all classes without converting to a JavaScript float.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

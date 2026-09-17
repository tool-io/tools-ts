import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ register: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "register", kind: "string", label: "register" },
  { id: "width", kind: "integer", label: "width" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.width, 1, 128);
  const p = H.bigint(i.register);
  H.check(p >= 0n && p < 1n << BigInt(i.width));
  let reflected = 0n;
  for (let j = 0; j < i.width; j++)
    reflected = (reflected << 1n) | ((p >> BigInt(j)) & 1n);
  return H.finish({ register: String(reflected) });
};
export const example = {
  input: { register: "3", width: 4 },
  output: { result: { register: "12" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/crc-register-bit-reflection",
  title: "CRC Register Bit Reflection",
  description:
    "Reflect exactly the supplied CRC register word width, including leading zeros; distinct from reciprocal-polynomial coefficient reversal.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

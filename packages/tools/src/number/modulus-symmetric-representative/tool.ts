import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ integer: string; modulus: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "integer", label: "Integer", kind: "string" },
  { id: "modulus", label: "Modulus", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const n = H.big(i.integer),
    m = H.big(i.modulus);
  H.check(m > 0n);
  const r = ((n % m) + m) % m;
  return H.finish({ representative: String(r * 2n >= m ? r - m : r) });
};
export const example = {
  input: { integer: "8", modulus: "10" },
  output: { result: { representative: "-2" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/modulus-symmetric-representative",
  title: "Number: Modulus Symmetric Representative Tool",
  description:
    "Return the exact symmetric residue in [-m/2,m/2), choosing the negative representative at even-modulus ties.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { representative: { type: "string" } },
        required: ["representative"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

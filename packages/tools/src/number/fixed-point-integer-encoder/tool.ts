import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ decimal: string; fractionalBits: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "decimal", kind: "string", label: "decimal" },
  { id: "fractionalBits", kind: "integer", label: "fractionalBits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.fractionalBits, 0, 128);
  const [n, d] = H.decimalFraction(i.decimal),
    scaled = n * (1n << BigInt(i.fractionalBits));
  H.check(scaled % d === 0n, "Not exactly representable");
  return H.finish({ integer: String(scaled / d) });
};
export const example = {
  input: { decimal: "1.25", fractionalBits: 3 },
  output: { result: { integer: "10" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/fixed-point-integer-encoder",
  title: "Fixed Point Integer Encoder",
  description:
    "Encode exact decimal text on a binary fixed-point grid; rejects values requiring rounding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { integer: { type: "string" } },
        required: ["integer"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

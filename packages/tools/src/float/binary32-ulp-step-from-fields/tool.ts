import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "pattern", label: "pattern", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const f = H.floatFields(i.pattern, 32);
  H.check(f.kind !== "nan" && f.kind !== "infinity");
  return H.finish({
    binaryExponent:
      f.exponent === 0 ? -149 : f.exponent - f.bias - f.fractionBits,
  });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { binaryExponent: -23 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "IEEE Binary32 ULP Step from Fields",
      "floating-point arithmetic",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["float", "floating-point arithmetic", "mathematics"],
    keywords: ["floating-point arithmetic", "mathematics"],
  },
  id: "float/binary32-ulp-step-from-fields",
  title: "IEEE Binary32 ULP Step from Fields",
  description:
    "Return binary32 normal-binade/subnormal ULP spacing as exact power-of-two exponent; at powers of two this is the toward-increasing-magnitude binade spacing, not both neighboring gaps.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { binaryExponent: { type: "number" } },
        required: ["binaryExponent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

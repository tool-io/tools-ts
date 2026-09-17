import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", label: "pattern", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const f = H.floatFields(i.pattern, 16),
    finite = f.kind !== "nan" && f.kind !== "infinity",
    significand =
      (f.exponent === 0
        ? f.fraction
        : (1n << BigInt(f.fractionBits)) + f.fraction) * (f.sign ? -1n : 1n);
  return H.finish({
    classification: f.kind,
    dyadic: finite
      ? {
          significand: String(significand),
          binaryExponent:
            f.exponent === 0
              ? 1 - f.bias - f.fractionBits
              : f.exponent - f.bias - f.fractionBits,
          negativeZero: f.kind === "zero" && f.sign === 1,
        }
      : null,
  });
};
export const example = {
  input: { pattern: "15360" },
  output: {
    result: {
      classification: "normal",
      dyadic: { significand: "1024", binaryExponent: -10, negativeZero: false },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary16-exact-dyadic-record",
  title: "IEEE Binary16 Exact Dyadic Record",
  description:
    "Decode an exact IEEE binary16 raw pattern into signed integer significand times 2^binaryExponent; infinity/NaN have null dyadic value, negative zero remains explicit.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

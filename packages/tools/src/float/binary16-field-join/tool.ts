import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  sign: number;
  exponent: number;
  fraction: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "sign", label: "sign", kind: "integer" },
  { id: "exponent", label: "exponent", kind: "integer" },
  { id: "fraction", label: "fraction", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.sign, 0, 1);
  H.int(i.exponent, 0, 31);
  const fraction = H.bigint(i.fraction);
  H.check(fraction >= 0n && fraction < 1n << 10n);
  return H.finish({
    pattern: String(
      (BigInt(i.sign) << 15n) | (BigInt(i.exponent) << 10n) | fraction,
    ),
  });
};
export const example = {
  input: { sign: 0, exponent: 15, fraction: "0" },
  output: { result: { pattern: "15360" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "IEEE Binary16 Field Joiner",
      "floating-point arithmetic",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["float", "floating-point arithmetic", "mathematics"],
    keywords: ["floating-point arithmetic", "mathematics"],
  },
  id: "float/binary16-field-join",
  title: "IEEE Binary16 Field Joiner",
  description:
    "Join explicit IEEE binary16 sign/exponent/fraction fields into exact raw integer pattern text; permits all classes without converting to a JavaScript float.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { pattern: { type: "string" } },
        required: ["pattern"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

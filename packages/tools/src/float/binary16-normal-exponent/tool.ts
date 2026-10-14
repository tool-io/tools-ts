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
  const f = H.floatFields(i.pattern, 16);
  return H.finish({
    classification: f.kind,
    exponent: f.kind === "normal" ? f.exponent - f.bias : null,
  });
};
export const example = {
  input: { pattern: "15360" },
  output: { result: { classification: "normal", exponent: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "IEEE Binary16 Normal Exponent",
      "floating-point arithmetic",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["float", "floating-point arithmetic", "mathematics"],
    keywords: ["floating-point arithmetic", "mathematics"],
  },
  id: "float/binary16-normal-exponent",
  title: "IEEE Binary16 Normal Exponent",
  description:
    "Decode unbiased exponent only for an IEEE binary16 normal raw pattern; other classes have null normal exponent, not an inferred finite value.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          classification: { type: "string" },
          exponent: { anyOf: [{ type: "number" }, { type: "null" }] },
        },
        required: ["classification", "exponent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

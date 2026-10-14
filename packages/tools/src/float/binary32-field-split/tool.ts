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
  return H.finish({
    sign: f.sign,
    exponent: f.exponent,
    fraction: String(f.fraction),
  });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { sign: 0, exponent: 127, fraction: "0" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "IEEE Binary32 Field Splitter",
      "floating-point arithmetic",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["float", "floating-point arithmetic", "mathematics"],
    keywords: ["floating-point arithmetic", "mathematics"],
  },
  id: "float/binary32-field-split",
  title: "IEEE Binary32 Field Splitter",
  description:
    "Split an exact unsigned IEEE binary32 integer bit pattern into fields, preserving all NaN payload bits and signed-zero evidence.",
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
          sign: { type: "number" },
          exponent: { type: "number" },
          fraction: { type: "string" },
        },
        required: ["sign", "exponent", "fraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

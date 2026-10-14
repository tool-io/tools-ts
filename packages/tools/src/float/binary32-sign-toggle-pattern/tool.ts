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
  return H.finish({
    pattern: String(H.floatFields(i.pattern, 32).bits ^ (1n << 31n)),
  });
};
export const example = {
  input: { pattern: "1065353216" },
  output: { result: { pattern: "3212836864" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "IEEE Binary32 Sign Toggle Pattern",
      "floating-point arithmetic",
      "mathematics",
    ],
    collections: ["data", "learn"],
    fields: ["float", "floating-point arithmetic", "mathematics"],
    keywords: ["floating-point arithmetic", "mathematics"],
  },
  id: "float/binary32-sign-toggle-pattern",
  title: "IEEE Binary32 Sign Toggle Pattern",
  description:
    "Toggle only the sign bit of an IEEE binary32 raw pattern, including zeros, infinities and NaNs without altering payload bits.",
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

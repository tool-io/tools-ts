import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ checksums: readonly string[]; bits: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "checksums", kind: "stringList", label: "checksums" },
  { id: "bits", kind: "integer", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  const limit = 1n << BigInt(i.bits);
  return H.finish({
    violations: i.checksums.flatMap((s, index) => {
      const value = H.bigint(s);
      return value < 0n || value >= limit ? [{ index, value: s }] : [];
    }),
  });
};
export const example = {
  input: { checksums: ["0", "15", "16", "-1"], bits: 4 },
  output: {
    result: {
      violations: [
        { index: 2, value: "16" },
        { index: 3, value: "-1" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "integrity/checksum-record-width-audit",
  title: "Checksum Record Width Audit",
  description:
    "Audit exact checksum-record integer values against an explicit unsigned bit width; report range failures while rejecting malformed integer spellings.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                value: { type: "string" },
              },
              required: ["index", "value"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

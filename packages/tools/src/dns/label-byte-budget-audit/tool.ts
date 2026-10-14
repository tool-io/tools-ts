import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ labelsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "labelsJson", kind: "string", label: "labelsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const labels = H.dnsLabels(i.labelsJson, false),
    wireBytes = labels.reduce((s, r) => s + r.length + 1, 1);
  return H.finish({
    labelViolations: labels.flatMap((r, j) =>
      r.length > 63 ? [{ index: j, bytes: r.length }] : [],
    ),
    wireBytes,
    nameFits: wireBytes <= 255,
  });
};
export const example = {
  input: {
    labelsJson:
      "[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]]",
  },
  output: {
    result: {
      labelViolations: [{ index: 0, bytes: 64 }],
      wireBytes: 66,
      nameFits: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/label-byte-budget-audit",
  title: "DNS Label Byte Budget Audit",
  description:
    "Audit supplied DNS label byte lengths and total uncompressed wire-name budget independently; no text character count or IDNA assumption.",
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
          labelViolations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                bytes: { type: "number" },
              },
              required: ["index", "bytes"],
            },
          },
          wireBytes: { type: "number" },
          nameFits: { type: "boolean" },
        },
        required: ["labelViolations", "wireBytes", "nameFits"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

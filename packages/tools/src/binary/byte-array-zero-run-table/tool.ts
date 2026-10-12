import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bytes: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", kind: "numberList", label: "bytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.bytes(i.bytes);
  const runs: { start: number; end: number }[] = [];
  for (let j = 0; j < i.bytes.length;) {
    if (i.bytes[j]) {
      j++;
      continue;
    }
    const start = j;
    while (j < i.bytes.length && i.bytes[j] === 0) j++;
    runs.push({ start, end: j });
  }
  return H.finish({ runs });
};
export const example = {
  input: { bytes: [0, 0, 2, 0] },
  output: {
    result: {
      runs: [
        { start: 0, end: 2 },
        { start: 3, end: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/byte-array-zero-run-table",
  title: "Byte Array Zero Run Table",
  description:
    "Return maximal half-open zero-byte runs, preserving run positions rather than compressing the payload.",
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
          runs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["start", "end"],
            },
          },
        },
        required: ["runs"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

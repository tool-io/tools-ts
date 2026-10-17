import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ countsJson: string; keysJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "countsJson", kind: "string", label: "countsJson" },
  { id: "keysJson", kind: "string", label: "keysJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.msRows(H.multiset(i.countsJson)),
    keys = H.arr(i.keysJson).map((v) => JSON.stringify(v));
  return H.finish({
    selected: r.filter((v) => keys.includes(JSON.stringify(v.value))),
    remainder: r.filter((v) => !keys.includes(JSON.stringify(v.value))),
  });
};
export const example = {
  input: {
    countsJson: '[{"value":"a","count":3},{"value":"b","count":1}]',
    keysJson: '["a"]',
  },
  output: {
    result: {
      selected: [{ value: "a", count: 3 }],
      remainder: [{ value: "b", count: 1 }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/multiplicity-partition-by-key-bank",
  title: "Multiset Partition by Key Bank",
  description:
    "Partition a typed multiset by exact caller-supplied scalar key identities while retaining multiplicities and first-appearance order.",
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
          selected: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" },
                  ],
                },
                count: { type: "number" },
              },
              required: ["value", "count"],
            },
          },
          remainder: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" },
                  ],
                },
                count: { type: "number" },
              },
              required: ["value", "count"],
            },
          },
        },
        required: ["selected", "remainder"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

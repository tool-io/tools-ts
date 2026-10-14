import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ recordsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "recordsJson", kind: "string", label: "recordsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.records(i.recordsJson).map((v) => ({
    priority: H.int(H.num(v.priority), 0, 65535),
    weight: H.int(H.num(v.weight), 0, 65535),
    port: H.int(H.num(v.port), 0, 65535),
    target: H.str(v.target),
  }));
  return H.finish({
    buckets: H.groups(r, (v) => String(v.priority))
      .sort((a, b) => Number(a.key) - Number(b.key))
      .map((g) => ({
        priority: Number(g.key),
        records: g.indexes.map((j) => r[j]),
        weightTotal: g.indexes.reduce((s, j) => s + r[j].weight, 0),
      })),
  });
};
export const example = {
  input: {
    recordsJson:
      '[{"priority":10,"weight":2,"port":80,"target":"a"},{"priority":10,"weight":3,"port":80,"target":"b"}]',
  },
  output: {
    result: {
      buckets: [
        {
          priority: 10,
          records: [
            { priority: 10, weight: 2, port: 80, target: "a" },
            { priority: 10, weight: 3, port: 80, target: "b" },
          ],
          weightTotal: 5,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dns/srv-priority-bucket-table",
  title: "DNS SRV Priority Bucket Table",
  description:
    "Bucket explicit DNS SRV records by ascending priority with raw weights and total weight evidence; does not implement weighted target selection or availability inference.",
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
          buckets: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                priority: { type: "number" },
                records: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      priority: { type: "number" },
                      weight: { type: "number" },
                      port: { type: "number" },
                      target: { type: "string" },
                    },
                    required: ["priority", "weight", "port", "target"],
                  },
                },
                weightTotal: { type: "number" },
              },
              required: ["priority", "records", "weightTotal"],
            },
          },
        },
        required: ["buckets"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

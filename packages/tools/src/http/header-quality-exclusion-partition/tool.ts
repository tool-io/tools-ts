import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ qualitiesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "qualitiesJson", label: "qualitiesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.qualities(i.qualitiesJson);
  return H.finish({
    excluded: r.filter((v) => v.q === 0),
    eligible: r.filter((v) => v.q > 0),
  });
};
export const example = {
  input: {
    qualitiesJson:
      '[{"token":"a","q":0},{"token":"b","q":0.5},{"token":"c","q":1}]',
  },
  output: {
    result: {
      excluded: [{ token: "a", q: 0 }],
      eligible: [
        { token: "b", q: 0.5 },
        { token: "c", q: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Quality Exclusion Partitioner", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-quality-exclusion-partition",
  title: "HTTP Quality Exclusion Partitioner",
  description:
    "Partition explicitly supplied token quality weights into q=0 exclusions and positive candidates; validates HTTP thousandth precision, no negotiation inference.",
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
          excluded: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { token: { type: "string" }, q: { type: "number" } },
              required: ["token", "q"],
            },
          },
          eligible: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { token: { type: "string" }, q: { type: "number" } },
              required: ["token", "q"],
            },
          },
        },
        required: ["excluded", "eligible"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

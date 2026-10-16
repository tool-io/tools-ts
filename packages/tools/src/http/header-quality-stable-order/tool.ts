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
  return H.finish({
    qualities: H.qualities(i.qualitiesJson)
      .map((v, index) => ({ ...v, index }))
      .sort((a, b) => b.q - a.q || a.index - b.index),
  });
};
export const example = {
  input: {
    qualitiesJson:
      '[{"token":"a","q":0},{"token":"b","q":0.5},{"token":"c","q":1}]',
  },
  output: {
    result: {
      qualities: [
        { token: "c", q: 1, index: 2 },
        { token: "b", q: 0.5, index: 1 },
        { token: "a", q: 0, index: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Quality Stable Order", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-quality-stable-order",
  title: "HTTP Quality Stable Order",
  description:
    "Stable descending explicit HTTP quality ordering with original indexes and zero-quality entries retained; not full Accept specificity negotiation.",
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
          qualities: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                token: { type: "string" },
                q: { type: "number" },
                index: { type: "number" },
              },
              required: ["token", "q", "index"],
            },
          },
        },
        required: ["qualities"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

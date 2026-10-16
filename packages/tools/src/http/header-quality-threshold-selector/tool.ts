import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ qualitiesJson: string; threshold: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "qualitiesJson", label: "qualitiesJson", kind: "string" },
  { id: "threshold", label: "threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.qualities(i.qualitiesJson);
  H.unit(i.threshold);
  return H.finish({ selected: r.filter((v) => v.q > 0 && v.q >= i.threshold) });
};
export const example = {
  input: {
    qualitiesJson:
      '[{"token":"a","q":0},{"token":"b","q":0.5},{"token":"c","q":1}]',
    threshold: 0.5,
  },
  output: {
    result: {
      selected: [
        { token: "b", q: 0.5 },
        { token: "c", q: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Quality Threshold Selector", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-quality-threshold-selector",
  title: "HTTP Quality Threshold Selector",
  description:
    "Select positive explicit HTTP qualities at or above a supplied unit threshold; q=0 remains excluded even at threshold zero.",
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
          selected: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { token: { type: "string" }, q: { type: "number" } },
              required: ["token", "q"],
            },
          },
        },
        required: ["selected"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

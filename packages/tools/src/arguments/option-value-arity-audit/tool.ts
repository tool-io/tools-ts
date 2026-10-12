import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  counts: readonly number[];
  minimum: number;
  maximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "counts", label: "counts", kind: "numberList" },
  { id: "minimum", label: "minimum", kind: "integer" },
  { id: "maximum", label: "maximum", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.minimum, 0, 128);
  H.int(i.maximum, i.minimum, 128);
  i.counts.forEach((x) => H.int(x, 0, 128));
  return H.finish({
    violations: i.counts.flatMap((count, index) =>
      count < i.minimum || count > i.maximum ? [{ index, count }] : [],
    ),
  });
};
export const example = {
  input: { counts: [0, 1, 2], minimum: 1, maximum: 1 },
  output: {
    result: {
      violations: [
        { index: 0, count: 0 },
        { index: 2, count: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Option Value Arity Audit"],
    collections: ["encode-decode"],
    fields: ["arguments"],
    keywords: [],
  },
  id: "arguments/option-value-arity-audit",
  title: "Option Value Arity Audit",
  description:
    "Audit explicitly supplied value counts for each option occurrence against an inclusive arity range; no greedy token assignment.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                count: { type: "number" },
              },
              required: ["index", "count"],
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

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  minimum: number;
  maximum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "values", kind: "numberList" },
  { id: "minimum", label: "minimum", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.maximum >= i.minimum);
  return H.finish({
    values: i.values.filter((x) => x >= i.minimum && x <= i.maximum),
    removed: i.values.flatMap((x, j) =>
      x < i.minimum || x > i.maximum ? [j] : [],
    ),
  });
};
export const example = {
  input: { values: [0, 2, 9], minimum: 1, maximum: 5 },
  output: { result: { values: [2], removed: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Trim Explicit Cutoffs"],
    collections: ["data", "learn"],
    fields: ["statistics"],
    keywords: [],
  },
  id: "statistics/trim-explicit-cutoffs",
  title: "Trim Explicit Cutoffs",
  description:
    "Trim observations strictly outside supplied numeric cutoffs, preserving original order and removal provenance; no quantile estimation.",
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
          values: { type: "array", items: { type: "number" } },
          removed: { type: "array", items: { type: "number" } },
        },
        required: ["values", "removed"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

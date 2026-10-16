import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ edges: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "edges", label: "edges", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const violations = i.edges
    .slice(1)
    .flatMap((x, j) =>
      x <= i.edges[j]
        ? [{ left: j, right: j + 1, difference: x - i.edges[j] }]
        : [],
    );
  return H.finish({
    valid: i.edges.length >= 2 && violations.length === 0,
    violations,
  });
};
export const example = {
  input: { edges: [0, 1, 1, 0] },
  output: {
    result: {
      valid: false,
      violations: [
        { left: 1, right: 2, difference: 0 },
        { left: 2, right: 3, difference: -1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Histogram Edge Monotonicity Audit", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/edge-monotonicity-audit",
  title: "Histogram Edge Monotonicity Audit",
  description:
    "Audit strict histogram edge monotonicity and minimum arity without silently sorting or removing equal/backwards edges; preserve signed adjacent differences.",
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
          valid: { type: "boolean" },
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                left: { type: "number" },
                right: { type: "number" },
                difference: { type: "number" },
              },
              required: ["left", "right", "difference"],
            },
          },
        },
        required: ["valid", "violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

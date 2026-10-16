import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  minimum: number;
  maximum: number;
  bins: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "minimum", label: "minimum", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
  { id: "bins", label: "bins", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.positive(i.minimum);
  H.check(i.maximum > i.minimum);
  H.int(i.bins, 1, 127);
  const edges = Array.from({ length: i.bins + 1 }, (_, j) =>
    j === 0
      ? i.minimum
      : j === i.bins
        ? i.maximum
        : Math.exp(
            Math.log(i.minimum) +
              ((Math.log(i.maximum) - Math.log(i.minimum)) * j) / i.bins,
          ),
  );
  H.histogramEdges(edges);
  return H.finish({ edges });
};
export const example = {
  input: { minimum: 1, maximum: 100, bins: 2 },
  output: { result: { edges: [1, 10, 100] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Histogram Log Spaced Edge Plan", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/log-spaced-edge-plan",
  title: "Histogram Log Spaced Edge Plan",
  description:
    "Plan positive logarithmically equally spaced histogram edges with explicit endpoints, rejecting unrepresentable spacing; not automatic bin selection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { edges: { type: "array", items: { type: "number" } } },
        required: ["edges"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

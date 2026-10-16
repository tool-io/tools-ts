import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ mass: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "mass", label: "mass", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.nonnegative(i.mass);
  return H.finish({
    runs: H.runs(i.mass, (x) => (x === 0 ? "empty" : "occupied"))
      .filter((v) => v.key === "empty")
      .map(({ start, end }) => ({ start, end })),
  });
};
export const example = {
  input: { mass: [0, 0, 1, 0] },
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
  discovery: {
    aliases: ["Histogram Empty Bin Run Table", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/bin-empty-run-table",
  title: "Histogram Empty Bin Run Table",
  description:
    "Identify maximal adjacent exactly zero histogram-mass runs, retaining half-open bin indexes; no smoothing or estimated density threshold.",
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
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

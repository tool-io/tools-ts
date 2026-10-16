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
    inclusive: i.mass.map((_, j) => i.mass.slice(j).reduce((s, x) => s + x, 0)),
  });
};
export const example = {
  input: { mass: [1, 3, 0] },
  output: { result: { inclusive: [4, 3, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Histogram Tail Mass Table", "histograms", "statistics"],
    collections: ["data", "learn"],
    fields: ["histogram", "histograms", "statistics"],
    keywords: ["histograms", "statistics"],
  },
  id: "histogram/bin-tail-mass-table",
  title: "Histogram Tail Mass Table",
  description:
    "Accumulate histogram tail masses including each current bin, preserving empty bins and raw nonnegative mass units.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { inclusive: { type: "array", items: { type: "number" } } },
        required: ["inclusive"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

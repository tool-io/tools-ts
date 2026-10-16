import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  intervals,
} from "../batch53-shared.js";

export type Input = Readonly<{
  intervals: readonly (readonly number[])[];
  sourceIds: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
  { id: "sourceIds", label: "Source ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = intervals(i.intervals);
  if (a.length !== i.sourceIds.length)
    simpleError("ids", "One source ID per interval.");
  unique(i.sourceIds, "ids");
  const sorted = a
      .map((r, j) => ({ start: r[0], end: r[1], sourceIds: [i.sourceIds[j]] }))
      .filter((r) => r.end > r.start)
      .sort((a, b) => a.start - b.start || a.end - b.end),
    out: typeof sorted = [];
  for (const r of sorted) {
    const last = out.at(-1);
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
      last.sourceIds.push(...r.sourceIds);
    } else out.push(r);
  }
  return { merged: out };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    intervals: [
      [0, 2],
      [1, 3],
    ],
    sourceIds: ["a", "b"],
  },
  output: { result: { merged: [{ start: 0, end: 3, sourceIds: ["a", "b"] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-merge-with-source-ids",
  title: "Interval Merge with Source IDs",
  description:
    "Merge overlapping/touching half-open intervals with complete source-ID provenance; zero-length intervals contribute no covered points.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          merged: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
                sourceIds: { type: "array", items: { type: "string" } },
              },
              required: ["start", "end", "sourceIds"],
            },
          },
        },
        required: ["merged"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  orderedPair,
  intervals,
} from "../batch53-shared.js";

export type Input = Readonly<{
  intervals: readonly (readonly number[])[];
  domainStart: number;
  domainEnd: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
  { id: "domainStart", label: "Domain start", kind: "number" },
  { id: "domainEnd", label: "Domain end", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  orderedPair(i.domainStart, i.domainEnd);
  return {
    audit: intervals(i.intervals).map(([s, e], sourceIndex) => {
      const start = Math.max(s, i.domainStart),
        end = Math.min(e, i.domainEnd);
      return {
        sourceIndex,
        start,
        end,
        empty: end <= start,
        clipped: start !== s || end !== e,
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    intervals: [
      [0, 2],
      [4, 5],
    ],
    domainStart: 1,
    domainEnd: 3,
  },
  output: {
    result: {
      audit: [
        { sourceIndex: 0, start: 1, end: 2, empty: false, clipped: true },
        { sourceIndex: 1, start: 4, end: 3, empty: true, clipped: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-clamp-and-empty-audit",
  title: "Interval Clamp and Empty Audit",
  description:
    "Audit raw clipped interval bounds and emptiness; disjoint intersections retain start>end as evidence, not a fabricated nonempty interval.",
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
          audit: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                sourceIndex: { type: "number" },
                start: { type: "number" },
                end: { type: "number" },
                empty: { type: "boolean" },
                clipped: { type: "boolean" },
              },
              required: ["sourceIndex", "start", "end", "empty", "clipped"],
            },
          },
        },
        required: ["audit"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

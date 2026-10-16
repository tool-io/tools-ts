import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, intervals } from "../batch53-shared.js";

export type Input = Readonly<{ intervals: readonly (readonly number[])[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "intervals", label: "Intervals", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = intervals(i.intervals),
    x = [...new Set(a.flat())].sort((a, b) => a - b);
  return {
    events: x.map((endpoint) => ({
      endpoint,
      startingIndexes: a.flatMap(([s, e], j) =>
        s === endpoint && e > s ? [j] : [],
      ),
      endingIndexes: a.flatMap(([s, e], j) =>
        e === endpoint && e > s ? [j] : [],
      ),
      emptyIndexes: a.flatMap(([s, e], j) =>
        s === endpoint && e === s ? [j] : [],
      ),
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    intervals: [
      [0, 1],
      [1, 2],
    ],
  },
  output: {
    result: {
      events: [
        {
          endpoint: 0,
          startingIndexes: [0],
          endingIndexes: [],
          emptyIndexes: [],
        },
        {
          endpoint: 1,
          startingIndexes: [1],
          endingIndexes: [0],
          emptyIndexes: [],
        },
        {
          endpoint: 2,
          startingIndexes: [],
          endingIndexes: [1],
          emptyIndexes: [],
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-endpoint-event-table",
  title: "Interval Endpoint Event Table",
  description:
    "Build grouped endpoint event tables with starts, ends and empty intervals separately; simultaneous events are not silently ordered.",
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
          events: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                endpoint: { type: "number" },
                startingIndexes: { type: "array", items: { type: "number" } },
                endingIndexes: { type: "array", items: { type: "number" } },
                emptyIndexes: { type: "array", items: { type: "number" } },
              },
              required: [
                "endpoint",
                "startingIndexes",
                "endingIndexes",
                "emptyIndexes",
              ],
            },
          },
        },
        required: ["events"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

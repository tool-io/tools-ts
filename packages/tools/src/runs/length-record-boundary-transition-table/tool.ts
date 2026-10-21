import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ runsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "runsJson", label: "runsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.lengthRuns(i.runsJson);
  const offsets = H.runOffsets(r);
  return H.finish({
    boundaries: r.slice(1).map((v, j) => ({
      offset: String(offsets[j + 1]),
      left: r[j].value,
      right: v.value,
      changed: r[j].value !== v.value,
    })),
  });
};
export const example = {
  input: {
    runsJson:
      '[{"value": "a", "length": "3"}, {"value": "a", "length": "2"}, {"value": "b", "length": "4"}]',
  },
  output: {
    result: {
      boundaries: [
        { offset: "3", left: "a", right: "a", changed: false },
        { offset: "5", left: "a", right: "b", changed: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Run Length Record Boundary Transition Table",
      "run-length encoding",
      "data compression",
    ],
    collections: ["data", "learn"],
    fields: ["runs", "run-length encoding", "data compression"],
    keywords: ["run-length encoding", "data compression"],
  },
  id: "runs/length-record-boundary-transition-table",
  title: "Run Length Record Boundary Transition Table",
  description:
    "Run lengths are positive exact integer decimal strings with literal string values, never expanded; report encoded run boundaries with exact logical offsets and equal-versus-changed neighboring values.",
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
          boundaries: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                offset: { type: "string" },
                left: { type: "string" },
                right: { type: "string" },
                changed: { type: "boolean" },
              },
              required: ["offset", "left", "right", "changed"],
            },
          },
        },
        required: ["boundaries"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

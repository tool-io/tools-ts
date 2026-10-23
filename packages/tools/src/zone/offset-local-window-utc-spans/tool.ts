import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ spansJson: string; start: number; end: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "spansJson", label: "spansJson", kind: "string" },
  { id: "start", label: "start", kind: "number" },
  { id: "end", label: "end", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const s = H.zoneSpans(i.spansJson);
  H.check(
    i.start <= i.end && Math.abs(i.start) <= 1e12 && Math.abs(i.end) <= 1e12,
  );
  return H.finish({
    pieces: s.flatMap((v, index) => {
      const start = Math.max(v.start, i.start - v.offset),
        end = Math.min(v.end, i.end - v.offset);
      return start < end ? [{ index, start, end, offset: v.offset }] : [];
    }),
  });
};
export const example = {
  input: {
    spansJson:
      '[{"start": 0, "end": 10, "offset": 0}, {"start": 10, "end": 20, "offset": 2}, {"start": 20, "end": 30, "offset": 0}]',
    start: 20,
    end: 21,
  },
  output: {
    result: {
      pieces: [
        { index: 1, start: 18, end: 19, offset: 2 },
        { index: 2, start: 20, end: 21, offset: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Local Window UTC Span List",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-local-window-utc-spans",
  title: "Time Zone Local Window UTC Span List",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; invert a local half-open window against every observed offset span, preserving multiple UTC solutions and source span indexes.",
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
          pieces: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                start: { type: "number" },
                end: { type: "number" },
                offset: { type: "number" },
              },
              required: ["index", "start", "end", "offset"],
            },
          },
        },
        required: ["pieces"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

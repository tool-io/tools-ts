import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ at: number; before: number; after: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "at", label: "at", kind: "number" },
  { id: "before", label: "before", kind: "number" },
  { id: "after", label: "after", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    Math.abs(i.at) <= 1e12 &&
      Math.abs(i.before) <= 86400 &&
      Math.abs(i.after) <= 86400,
  );
  return H.finish({
    span:
      i.after > i.before
        ? {
            start: i.at + Math.min(i.before, i.after),
            end: i.at + Math.max(i.before, i.after),
          }
        : null,
  });
};
export const example = {
  input: { at: 10, before: 0, after: 2 },
  output: { result: { span: { start: 10, end: 12 } } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Time Zone Transition Local Gap Span",
      "time zones",
      "UTC offsets",
    ],
    collections: ["data", "learn"],
    fields: ["zone", "time zones", "UTC offsets"],
    keywords: ["time zones", "UTC offsets"],
  },
  id: "zone/offset-transition-local-gap-span",
  title: "Time Zone Transition Local Gap Span",
  description:
    "Supplied synthetic civil-second offset observations only, no IANA database, DST rule inference or leap seconds; derive a single transition\u2019s local gap for a positive jump as a half-open interval; other jump signs return null.",
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
          span: {
            anyOf: [
              {
                type: "object",
                additionalProperties: false,
                properties: {
                  start: { type: "number" },
                  end: { type: "number" },
                },
                required: ["start", "end"],
              },
              { type: "null" },
            ],
          },
        },
        required: ["span"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{ utcDate: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "utcDate", label: "Utc date", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const tai = H.taiMinusUtc(H.julianDay(i.utcDate, 0));
  return H.finish({
    leapSecondsSince1972: tai - 10,
    taiMinusUtcSeconds: tai,
    reference: "IERS Bulletin C 72, valid before 2027-06-28",
  });
};
export const example = {
  input: { utcDate: "2017-01-01" },
  output: {
    result: {
      leapSecondsSince1972: 27,
      taiMinusUtcSeconds: 37,
      reference: "IERS Bulletin C 72, valid before 2027-06-28",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Leap Second Count Since 1972 Counter", "surveying"],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/leap-second-count-since-1972-counter",
  title: "Leap Second Count Since 1972 Counter",
  description:
    "Count actual published positive leap seconds since the 1972 ten-second TAI-UTC baseline using a pinned IERS table; rejects dates before 1972 or beyond its stated expiration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leapSecondsSince1972: { type: "number" },
          taiMinusUtcSeconds: { type: "number" },
          reference: { type: "string" },
        },
        required: ["leapSecondsSince1972", "taiMinusUtcSeconds", "reference"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

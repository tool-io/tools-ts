import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ date: string; timezoneAnnotation: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "date", label: "Date", kind: "string" },
  { id: "timezoneAnnotation", label: "Timezone annotation", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.civil(i.date);
  H.check(
    i.timezoneAnnotation.trim().length > 0 &&
      i.timezoneAnnotation.length <= 128 &&
      !/[\r\n]/.test(i.timezoneAnnotation),
  );
  return H.finish({
    date: i.date,
    timezoneAnnotation: i.timezoneAnnotation,
    resolvesInstant: false,
  });
};
export const example = {
  input: { date: "2024-01-01", timezoneAnnotation: "Europe/London" },
  output: {
    result: {
      date: "2024-01-01",
      timezoneAnnotation: "Europe/London",
      resolvesInstant: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/date-only-timezone-annotation",
  title: "Date: Date Only Timezone Annotation Tool",
  description:
    "Attach an explicit zone annotation to a validated date-only value while retaining that it does not resolve a clock time or instant; annotation is not an IANA lookup.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          date: { type: "string" },
          resolvesInstant: { type: "boolean" },
          timezoneAnnotation: { type: "string" },
        },
        required: ["date", "resolvesInstant", "timezoneAnnotation"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

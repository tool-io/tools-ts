import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  field: string;
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "field", label: "Field", kind: "string" },
  { id: "minimum", label: "Minimum", kind: "integer" },
  { id: "maximum", label: "Maximum", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.minimum, 0, 1000);
  H.int(i.maximum, i.minimum, i.minimum + 127);
  const m = /^(\*|\d{1,4}-\d{1,4})\/(\d{1,4})(?![\s\S])/.exec(i.field);
  H.check(m);
  const range =
      m![1] === "*" ? [i.minimum, i.maximum] : m![1].split("-").map(Number),
    [start, end] = range,
    step = Number(m![2]);
  H.int(start, i.minimum, i.maximum);
  H.int(end, start, i.maximum);
  H.int(step, 1, 1000);
  return H.finish({
    values: Array.from(
      { length: Math.floor((end - start) / step) + 1 },
      (_, j) => start + j * step,
    ),
  });
};
export const example = {
  input: { field: "1-7/2", minimum: 0, maximum: 9 },
  output: { result: { values: [1, 3, 5, 7] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/crontab-step-single-field",
  title: "Parsing: Crontab Step Single Field Tool",
  description:
    "Expand one bounded cron wildcard/range step field with inclusive bounds; excludes lists, names, wrap ranges and day-of-week aliases.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { values: { type: "array", items: { type: "number" } } },
        required: ["values"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

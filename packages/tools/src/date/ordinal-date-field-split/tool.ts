import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(\d{4})-(\d{3})(?![\s\S])/.exec(i.token);
  H.check(m);
  const y = Number(m![1]),
    leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  H.int(y, 1, 9999);
  H.int(Number(m![2]), 1, leap ? 366 : 365);
  return H.finish({ year: Number(m![1]), dayOfYear: Number(m![2]) });
};
export const example = {
  input: { token: "2024-060" },
  output: { result: { year: 2024, dayOfYear: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/ordinal-date-field-split",
  title: "Date: Ordinal Date Field Split Tool",
  description:
    "Parse a strict Gregorian YYYY-DDD ordinal-date field and validate its leap-aware day-of-year domain.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { dayOfYear: { type: "number" }, year: { type: "number" } },
        required: ["dayOfYear", "year"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

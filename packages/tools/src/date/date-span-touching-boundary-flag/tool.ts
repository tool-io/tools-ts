import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  firstStart: string;
  firstEnd: string;
  secondStart: string;
  secondEnd: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstStart", label: "First start", kind: "string" },
  { id: "firstEnd", label: "First end", kind: "string" },
  { id: "secondStart", label: "Second start", kind: "string" },
  { id: "secondEnd", label: "Second end", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const [a0, a1, b0, b1] = [
    i.firstStart,
    i.firstEnd,
    i.secondStart,
    i.secondEnd,
  ].map((s) => H.civil(s).getTime());
  H.check(a0 < a1 && b0 < b1);
  return H.finish({
    touching: a1 === b0 || b1 === a0,
    positiveLengthOverlap: Math.max(a0, b0) < Math.min(a1, b1),
  });
};
export const example = {
  input: {
    firstStart: "2024-01-01",
    firstEnd: "2024-01-03",
    secondStart: "2024-01-03",
    secondEnd: "2024-01-05",
  },
  output: { result: { touching: true, positiveLengthOverlap: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/date-span-touching-boundary-flag",
  title: "Date: Date Span Touching Boundary Flag Tool",
  description:
    "Distinguish exact boundary contact from positive-length overlap between two nonempty half-open civil-date spans; no timezone or business-day interpretation.",
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
          positiveLengthOverlap: { type: "boolean" },
          touching: { type: "boolean" },
        },
        required: ["positiveLengthOverlap", "touching"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

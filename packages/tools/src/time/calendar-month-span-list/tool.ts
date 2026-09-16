import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startYear", kind: "integer", label: "startYear" },
  { id: "startMonth", kind: "integer", label: "startMonth" },
  { id: "endYear", kind: "integer", label: "endYear" },
  { id: "endMonth", kind: "integer", label: "endMonth" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.startYear, -1e6, 1e6);
  H.int(i.endYear, -1e6, 1e6);
  H.int(i.startMonth, 1, 12);
  H.int(i.endMonth, 1, 12);
  const a = i.startYear * 12 + i.startMonth - 1,
    b = i.endYear * 12 + i.endMonth - 1;
  H.int(b - a, 0, 127);
  return H.finish({
    months: Array.from({ length: b - a + 1 }, (_, j) => ({
      year: Math.floor((a + j) / 12),
      month: H.mod(a + j, 12) + 1,
    })),
  });
};
export const example = {
  input: { startYear: 2025, startMonth: 12, endYear: 2026, endMonth: 2 },
  output: {
    result: {
      months: [
        { year: 2025, month: 12 },
        { year: 2026, month: 1 },
        { year: 2026, month: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/calendar-month-span-list",
  title: "Calendar Month Span List",
  description:
    "List an inclusive bounded proleptic month span with explicit start and end; rejects backwards or oversized spans.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ startWeekday: number; workingMask: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startWeekday", label: "Start weekday", kind: "integer" },
  { id: "workingMask", label: "Working mask", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.startWeekday, 0, 6);
  H.int(i.workingMask, 0, 127);
  const offset =
    Array.from({ length: 7 }, (_, j) => j).find(
      (j) =>
        Math.floor(i.workingMask / 2 ** ((i.startWeekday + j) % 7)) % 2 === 1,
    ) ?? -1;
  return H.finish({ found: offset >= 0, offsetDays: offset });
};
export const example = {
  input: { startWeekday: 5, workingMask: 31 },
  output: { result: { found: true, offsetDays: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/weekmask-first-working-day-offset",
  title: "Date: Weekmask First Working Day Offset Tool",
  description:
    "Find the first included working weekday on or after a supplied Monday-zero weekday under a seven-bit mask; no holiday calendar or elapsed-hour assumptions.",
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
          found: { type: "boolean" },
          offsetDays: { type: "number" },
        },
        required: ["found", "offsetDays"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;

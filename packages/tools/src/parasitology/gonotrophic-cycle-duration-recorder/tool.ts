import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch53-shared.js";

export type Input = Readonly<{ startDate: string; endDate: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "startDate", label: "Start date", kind: "string" },
  { id: "endDate", label: "End date", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const durationDays = daysBetween(i.startDate, i.endDate);
  nonnegative(durationDays, "duration");
  return { recordedDurationDays: durationDays };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { startDate: "2026-01-01", endDate: "2026-01-04" },
  output: { result: { recordedDurationDays: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/gonotrophic-cycle-duration-recorder",
  title: "Gonotrophic Cycle Days Duration Recorder",
  description:
    "Record observed gonotrophic-cycle elapsed calendar days, not a species-default duration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;

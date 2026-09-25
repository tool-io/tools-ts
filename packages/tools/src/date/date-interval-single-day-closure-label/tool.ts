import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly start: string;
  readonly end: string;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly days: number; readonly empty: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "string", maxLength: 8192 },
    end: { type: "string", maxLength: 8192 },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: ["start", "end", "includeStart", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { days: { type: "integer" }, empty: { type: "boolean" } },
  required: ["days", "empty"],
} as const;
/** Compute date interval single day closure label from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { start, end, includeStart, includeEnd } = input;
  const compute = (): Output => {
    const a = dateOnly(start),
      b = dateOnly(end);
    domain(a <= b);
    const days = Math.max(
      0,
      (b.getTime() - a.getTime()) / 86400000 -
        1 +
        (includeStart ? 1 : 0) +
        (includeEnd ? 1 : 0),
    );
    return { days, empty: days === 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    start: "2024-01-01",
    end: "2024-01-03",
    includeStart: true,
    includeEnd: true,
  },
  output: { days: 3, empty: false },
} satisfies ToolExample<Input, Output>;
export const dateIntervalSingleDayClosureLabelTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/date-interval-single-day-closure-label",
  title: "Date Interval Single Day Closure Label Tool",
  description:
    "Compute date interval single day closure label from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "start",
        label: "Start",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "end",
        label: "End",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "includeStart",
        label: "Include Start",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "includeEnd",
        label: "Include End",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "days", label: "Days", valueType: { type: "integer" } },
      { id: "empty", label: "Empty", valueType: { type: "boolean" } },
    ],
  },
});
export const run = dateIntervalSingleDayClosureLabelTool.execute;
export default dateIntervalSingleDayClosureLabelTool;

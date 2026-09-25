import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly start: string; readonly endExclusive: string };
export type Output = { readonly contained: boolean; readonly empty: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "string", maxLength: 8192 },
    endExclusive: { type: "string", maxLength: 8192 },
  },
  required: ["start", "endExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contained: { type: "boolean" }, empty: { type: "boolean" } },
  required: ["contained", "empty"],
} as const;
/** Calculate calendar interval single month containment from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { start, endExclusive } = input;
  const compute = (): Output => {
    const a = H.dateOnly(start),
      b = H.dateOnly(endExclusive);
    H.domain(a <= b);
    const empty = a.getTime() === b.getTime(),
      last = new Date(b.getTime() - 86400000);
    return {
      contained:
        empty ||
        (a.getUTCFullYear() === last.getUTCFullYear() &&
          a.getUTCMonth() === last.getUTCMonth()),
      empty,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: "2026-10-01", endExclusive: "2026-11-01" },
  output: { contained: true, empty: false },
} satisfies ToolExample<Input, Output>;
export const calendarIntervalSingleMonthContainmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "date/calendar-interval-single-month-containment",
      title: "Calendar Interval Single Month Containment Tool",
      description:
        "Calculate calendar interval single month containment from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          start: { type: "string", maxLength: 8192 },
          endExclusive: { type: "string", maxLength: 8192 },
        },
        required: ["start", "endExclusive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contained: { type: "boolean" },
          empty: { type: "boolean" },
        },
        required: ["contained", "empty"],
      },
      ports: {
        inputs: [
          {
            id: "start",
            label: "Start",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "endExclusive",
            label: "End Exclusive",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "contained",
            label: "Contained",
            valueType: { type: "boolean" },
          },
          { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = calendarIntervalSingleMonthContainmentTool.execute;
export default calendarIntervalSingleMonthContainmentTool;

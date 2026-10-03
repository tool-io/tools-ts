import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly date: string;
  readonly holidays: readonly string[];
  readonly forward: boolean;
};
export type Output = {
  readonly adjusted: string;
  readonly shiftedDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    holidays: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    forward: { type: "boolean" },
  },
  required: ["date", "holidays", "forward"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjusted: { type: "string", maxLength: 8192 },
    shiftedDays: { type: "integer" },
  },
  required: ["adjusted", "shiftedDays"],
} as const;
/** Shift over only the explicit holiday dates in the selected direction; weekends are not implicitly excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, holidays, forward } = request;
  const compute = (): Output => {
    const holidaySet = new Set(
        holidays.map((x) => {
          H.dateOnly(x);
          return x;
        }),
      ),
      current = H.dateOnly(date);
    let adjusted = date,
      shiftedDays = 0;
    while (holidaySet.has(adjusted)) {
      current.setUTCDate(current.getUTCDate() + (forward ? 1 : -1));
      shiftedDays += forward ? 1 : -1;
      adjusted = current.toISOString().slice(0, 10);
      H.dateOnly(adjusted);
    }
    return { adjusted, shiftedDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    date: "2026-10-26",
    holidays: ["2026-10-26", "2026-10-27"],
    forward: true,
  },
  output: { adjusted: "2026-10-28", shiftedDays: 2 },
} satisfies ToolExample<Input, Output>;
export const administrativeDeadlineSuppliedHolidayShiftTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/administrative-deadline-supplied-holiday-shift",
      title: "Administrative Deadline Supplied Holiday Shift Tool",
      description:
        "Shift over only the explicit holiday dates in the selected direction; weekends are not implicitly excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          date: { type: "string", maxLength: 8192 },
          holidays: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          forward: { type: "boolean" },
        },
        required: ["date", "holidays", "forward"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          adjusted: { type: "string", maxLength: 8192 },
          shiftedDays: { type: "integer" },
        },
        required: ["adjusted", "shiftedDays"],
      },
      ports: {
        inputs: [
          {
            id: "date",
            label: "Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "holidays",
            label: "Holidays",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "forward",
            label: "Forward",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "adjusted", label: "Adjusted", valueType: { type: "string" } },
          {
            id: "shiftedDays",
            label: "Shifted Days",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = administrativeDeadlineSuppliedHolidayShiftTool.execute;
export default administrativeDeadlineSuppliedHolidayShiftTool;

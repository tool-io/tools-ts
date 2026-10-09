import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completeDays: number;
  readonly additionalHours: number;
  readonly suppliedHoursPerDay: number;
};
export type Output = { readonly equivalentDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeDays: { type: "integer", minimum: 0 },
    additionalHours: { type: "number", minimum: 0 },
    suppliedHoursPerDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["completeDays", "additionalHours", "suppliedHoursPerDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentDays: { type: "number" } },
  required: ["equivalentDays"],
} as const;
/** Combine explicit complete surveillance days with a partial day on a supplied hours-per-day basis without assigning calendar weeks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completeDays, additionalHours, suppliedHoursPerDay } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(completeDays) &&
        completeDays >= 0 &&
        completeDays <= Number.MAX_SAFE_INTEGER,
      "completeDays",
    ),
      completeDays);
    (H.domain(
      Number.isFinite(suppliedHoursPerDay) && suppliedHoursPerDay > 0,
      "suppliedHoursPerDay",
    ),
      suppliedHoursPerDay);
    H.domain(
      additionalHours >= 0 && additionalHours < suppliedHoursPerDay,
      "additionalHours",
    );
    return {
      equivalentDays: completeDays + additionalHours / suppliedHoursPerDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completeDays: 6, additionalHours: 12, suppliedHoursPerDay: 24 },
  output: { equivalentDays: 6.5 },
} satisfies ToolExample<Input, Output>;
export const surveillanceWeekPartialDayDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/surveillance-week-partial-day-denominator",
      title: "Surveillance Week Partial Day Denominator Tool",
      description:
        "Combine explicit complete surveillance days with a partial day on a supplied hours-per-day basis without assigning calendar weeks.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          completeDays: { type: "integer", minimum: 0 },
          additionalHours: { type: "number", minimum: 0 },
          suppliedHoursPerDay: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["completeDays", "additionalHours", "suppliedHoursPerDay"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { equivalentDays: { type: "number" } },
        required: ["equivalentDays"],
      },
      ports: {
        inputs: [
          {
            id: "completeDays",
            label: "Complete Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "additionalHours",
            label: "Additional Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedHoursPerDay",
            label: "Supplied Hours Per Day",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalentDays",
            label: "Equivalent Days",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = surveillanceWeekPartialDayDenominatorTool.execute;
export default surveillanceWeekPartialDayDenominatorTool;

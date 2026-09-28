import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beforeWeeklyHours: number;
  readonly afterWeeklyHours: number;
  readonly paidWeeksPerYear: number;
};
export type Output = {
  readonly remainingWorkFraction: number;
  readonly hoursReleasedPerWeek: number;
  readonly annualHoursReleased: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeWeeklyHours: { type: "number", exclusiveMinimum: 0 },
    afterWeeklyHours: { type: "number", minimum: 0 },
    paidWeeksPerYear: { type: "number", minimum: 0 },
  },
  required: ["beforeWeeklyHours", "afterWeeklyHours", "paidWeeksPerYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingWorkFraction: { type: "number" },
    hoursReleasedPerWeek: { type: "number" },
    annualHoursReleased: { type: "number" },
  },
  required: [
    "remainingWorkFraction",
    "hoursReleasedPerWeek",
    "annualHoursReleased",
  ],
} as const;
/** Calculate retirement transition part time hour share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeWeeklyHours, afterWeeklyHours, paidWeeksPerYear } = request;
  const compute = (): Output => {
    H.positive(beforeWeeklyHours);
    H.domain(afterWeeklyHours >= 0 && paidWeeksPerYear >= 0);
    return {
      remainingWorkFraction: afterWeeklyHours / beforeWeeklyHours,
      hoursReleasedPerWeek: beforeWeeklyHours - afterWeeklyHours,
      annualHoursReleased:
        (beforeWeeklyHours - afterWeeklyHours) * paidWeeksPerYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeWeeklyHours: 40, afterWeeklyHours: 16, paidWeeksPerYear: 48 },
  output: {
    remainingWorkFraction: 0.4,
    hoursReleasedPerWeek: 24,
    annualHoursReleased: 1152,
  },
} satisfies ToolExample<Input, Output>;
export const retirementTransitionPartTimeHourShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/retirement-transition-part-time-hour-share",
      title: "Retirement Transition Part Time Hour Share Tool",
      description:
        "Calculate retirement transition part time hour share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          beforeWeeklyHours: { type: "number", exclusiveMinimum: 0 },
          afterWeeklyHours: { type: "number", minimum: 0 },
          paidWeeksPerYear: { type: "number", minimum: 0 },
        },
        required: ["beforeWeeklyHours", "afterWeeklyHours", "paidWeeksPerYear"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingWorkFraction: { type: "number" },
          hoursReleasedPerWeek: { type: "number" },
          annualHoursReleased: { type: "number" },
        },
        required: [
          "remainingWorkFraction",
          "hoursReleasedPerWeek",
          "annualHoursReleased",
        ],
      },
      ports: {
        inputs: [
          {
            id: "beforeWeeklyHours",
            label: "Before Weekly Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "afterWeeklyHours",
            label: "After Weekly Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paidWeeksPerYear",
            label: "Paid Weeks Per Year",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingWorkFraction",
            label: "Remaining Work Fraction",
            valueType: { type: "number" },
          },
          {
            id: "hoursReleasedPerWeek",
            label: "Hours Released Per Week",
            valueType: { type: "number" },
          },
          {
            id: "annualHoursReleased",
            label: "Annual Hours Released",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = retirementTransitionPartTimeHourShareTool.execute;
export default retirementTransitionPartTimeHourShareTool;

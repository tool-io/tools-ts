import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workDays: number;
  readonly hoursPerDay: number;
  readonly holidayDays: number;
  readonly otherUnavailableHours: number;
  readonly assignedHours: number;
};
export type Output = {
  readonly availableHours: number;
  readonly remainingHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workDays: { type: "integer", minimum: 0 },
    hoursPerDay: { type: "number", minimum: 0 },
    holidayDays: { type: "number", minimum: 0 },
    otherUnavailableHours: { type: "number", minimum: 0 },
    assignedHours: { type: "number", minimum: 0 },
  },
  required: [
    "workDays",
    "hoursPerDay",
    "holidayDays",
    "otherUnavailableHours",
    "assignedHours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHours: { type: "number" },
    remainingHours: { type: "number" },
  },
  required: ["availableHours", "remainingHours"],
} as const;
/** Calculate workload availability holiday adjustment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    workDays,
    hoursPerDay,
    holidayDays,
    otherUnavailableHours,
    assignedHours,
  } = request;
  const compute = (): Output => {
    H.integer(workDays, 0);
    H.domain(
      hoursPerDay >= 0 &&
        holidayDays >= 0 &&
        holidayDays <= workDays &&
        otherUnavailableHours >= 0 &&
        otherUnavailableHours <= (workDays - holidayDays) * hoursPerDay &&
        assignedHours >= 0,
    );
    return {
      availableHours:
        (workDays - holidayDays) * hoursPerDay - otherUnavailableHours,
      remainingHours:
        (workDays - holidayDays) * hoursPerDay -
        otherUnavailableHours -
        assignedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    workDays: 20,
    hoursPerDay: 8,
    holidayDays: 2,
    otherUnavailableHours: 4,
    assignedHours: 130,
  },
  output: { availableHours: 140, remainingHours: 10 },
} satisfies ToolExample<Input, Output>;
export const workloadAvailabilityHolidayAdjustmentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "management/workload-availability-holiday-adjustment",
      title: "Workload Availability Holiday Adjustment Tool",
      description:
        "Calculate workload availability holiday adjustment from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workDays: { type: "integer", minimum: 0 },
          hoursPerDay: { type: "number", minimum: 0 },
          holidayDays: { type: "number", minimum: 0 },
          otherUnavailableHours: { type: "number", minimum: 0 },
          assignedHours: { type: "number", minimum: 0 },
        },
        required: [
          "workDays",
          "hoursPerDay",
          "holidayDays",
          "otherUnavailableHours",
          "assignedHours",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableHours: { type: "number" },
          remainingHours: { type: "number" },
        },
        required: ["availableHours", "remainingHours"],
      },
      ports: {
        inputs: [
          {
            id: "workDays",
            label: "Work Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "hoursPerDay",
            label: "Hours Per Day",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "holidayDays",
            label: "Holiday Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherUnavailableHours",
            label: "Other Unavailable Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "assignedHours",
            label: "Assigned Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "availableHours",
            label: "Available Hours",
            valueType: { type: "number" },
          },
          {
            id: "remainingHours",
            label: "Remaining Hours",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = workloadAvailabilityHolidayAdjustmentTool.execute;
export default workloadAvailabilityHolidayAdjustmentTool;

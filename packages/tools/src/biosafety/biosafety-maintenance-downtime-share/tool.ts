import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledHours: number;
  readonly plannedDown: number;
  readonly unplannedDown: number;
  readonly overlappingDown: number;
};
export type Output = {
  readonly downHours: number;
  readonly availableHours: number;
  readonly availability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledHours: { type: "number", exclusiveMinimum: 0 },
    plannedDown: { type: "number", minimum: 0 },
    unplannedDown: { type: "number", minimum: 0 },
    overlappingDown: { type: "number", minimum: 0 },
  },
  required: [
    "scheduledHours",
    "plannedDown",
    "unplannedDown",
    "overlappingDown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    downHours: { type: "number" },
    availableHours: { type: "number" },
    availability: { type: "number" },
  },
  required: ["downHours", "availableHours", "availability"],
} as const;
/** Equipment availability accounting from supplied downtime; no operating-safety determination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledHours, plannedDown, unplannedDown, overlappingDown } =
    request;
  const compute = (): Output => {
    H.positive(scheduledHours);
    H.domain(
      plannedDown >= 0 &&
        unplannedDown >= 0 &&
        overlappingDown >= 0 &&
        overlappingDown <= Math.min(plannedDown, unplannedDown) &&
        plannedDown + unplannedDown - overlappingDown <= scheduledHours,
    );
    return {
      downHours: plannedDown + unplannedDown - overlappingDown,
      availableHours:
        scheduledHours - plannedDown - unplannedDown + overlappingDown,
      availability:
        (scheduledHours - plannedDown - unplannedDown + overlappingDown) /
        scheduledHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledHours: 100,
    plannedDown: 10,
    unplannedDown: 5,
    overlappingDown: 2,
  },
  output: { downHours: 13, availableHours: 87, availability: 0.87 },
} satisfies ToolExample<Input, Output>;
export const biosafetyMaintenanceDowntimeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-maintenance-downtime-share",
    title: "Biosafety Maintenance Downtime Share Tool",
    description:
      "Equipment availability accounting from supplied downtime; no operating-safety determination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledHours: { type: "number", exclusiveMinimum: 0 },
        plannedDown: { type: "number", minimum: 0 },
        unplannedDown: { type: "number", minimum: 0 },
        overlappingDown: { type: "number", minimum: 0 },
      },
      required: [
        "scheduledHours",
        "plannedDown",
        "unplannedDown",
        "overlappingDown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        downHours: { type: "number" },
        availableHours: { type: "number" },
        availability: { type: "number" },
      },
      required: ["downHours", "availableHours", "availability"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledHours",
          label: "Scheduled Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedDown",
          label: "Planned Down",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unplannedDown",
          label: "Unplanned Down",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlappingDown",
          label: "Overlapping Down",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "downHours", label: "Down Hours", valueType: { type: "number" } },
        {
          id: "availableHours",
          label: "Available Hours",
          valueType: { type: "number" },
        },
        {
          id: "availability",
          label: "Availability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyMaintenanceDowntimeShareTool.execute;
export default biosafetyMaintenanceDowntimeShareTool;

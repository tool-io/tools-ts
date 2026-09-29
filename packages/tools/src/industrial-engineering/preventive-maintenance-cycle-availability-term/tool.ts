import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operatingHours: number;
  readonly plannedMaintenanceHours: number;
  readonly repairHours: number;
};
export type Output = {
  readonly calendarHours: number;
  readonly operationalAvailability: number;
  readonly plannedOnlyAvailability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatingHours: { type: "number", exclusiveMinimum: 0 },
    plannedMaintenanceHours: { type: "number", minimum: 0 },
    repairHours: { type: "number", minimum: 0 },
  },
  required: ["operatingHours", "plannedMaintenanceHours", "repairHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calendarHours: { type: "number" },
    operationalAvailability: { type: "number" },
    plannedOnlyAvailability: { type: "number" },
  },
  required: [
    "calendarHours",
    "operationalAvailability",
    "plannedOnlyAvailability",
  ],
} as const;
/** Observed cycle availability with explicit maintenance and repair time categories, not a reliability-derived steady-state estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { operatingHours, plannedMaintenanceHours, repairHours } = request;
  const compute = (): Output => {
    H.domain(
      operatingHours > 0 && plannedMaintenanceHours >= 0 && repairHours >= 0,
    );
    return {
      calendarHours: operatingHours + plannedMaintenanceHours + repairHours,
      operationalAvailability:
        operatingHours /
        (operatingHours + plannedMaintenanceHours + repairHours),
      plannedOnlyAvailability:
        operatingHours / (operatingHours + plannedMaintenanceHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { operatingHours: 90, plannedMaintenanceHours: 5, repairHours: 5 },
  output: {
    calendarHours: 100,
    operationalAvailability: 0.9,
    plannedOnlyAvailability: 0.9473684210526315,
  },
} satisfies ToolExample<Input, Output>;
export const preventiveMaintenanceCycleAvailabilityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/preventive-maintenance-cycle-availability-term",
      title: "Preventive Maintenance Cycle Availability Term Tool",
      description:
        "Observed cycle availability with explicit maintenance and repair time categories, not a reliability-derived steady-state estimate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          operatingHours: { type: "number", exclusiveMinimum: 0 },
          plannedMaintenanceHours: { type: "number", minimum: 0 },
          repairHours: { type: "number", minimum: 0 },
        },
        required: ["operatingHours", "plannedMaintenanceHours", "repairHours"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          calendarHours: { type: "number" },
          operationalAvailability: { type: "number" },
          plannedOnlyAvailability: { type: "number" },
        },
        required: [
          "calendarHours",
          "operationalAvailability",
          "plannedOnlyAvailability",
        ],
      },
      ports: {
        inputs: [
          {
            id: "operatingHours",
            label: "Operating Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "plannedMaintenanceHours",
            label: "Planned Maintenance Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "repairHours",
            label: "Repair Hours",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "calendarHours",
            label: "Calendar Hours",
            valueType: { type: "number" },
          },
          {
            id: "operationalAvailability",
            label: "Operational Availability",
            valueType: { type: "number" },
          },
          {
            id: "plannedOnlyAvailability",
            label: "Planned Only Availability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = preventiveMaintenanceCycleAvailabilityTermTool.execute;
export default preventiveMaintenanceCycleAvailabilityTermTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lastInspectionDay: number;
  readonly currentDay: number;
  readonly intervalDays: number;
  readonly graceDays: number;
};
export type Output = {
  readonly dueDay: number;
  readonly overdueDays: number;
  readonly withinGrace: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lastInspectionDay: { type: "integer" },
    currentDay: { type: "integer" },
    intervalDays: { type: "integer", minimum: 1 },
    graceDays: { type: "integer", minimum: 0 },
  },
  required: ["lastInspectionDay", "currentDay", "intervalDays", "graceDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dueDay: { type: "integer" },
    overdueDays: { type: "integer" },
    withinGrace: { type: "boolean" },
  },
  required: ["dueDay", "overdueDays", "withinGrace"],
} as const;
/** Audit an equipment record against supplied inspection timing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lastInspectionDay, currentDay, intervalDays, graceDays } = request;
  const compute = (): Output => {
    H.integer(intervalDays, 1);
    H.integer(graceDays, 0);
    H.domain(currentDay >= lastInspectionDay, "currentDay");
    return {
      dueDay: lastInspectionDay + intervalDays,
      overdueDays: Math.max(0, currentDay - lastInspectionDay - intervalDays),
      withinGrace: currentDay <= lastInspectionDay + intervalDays + graceDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lastInspectionDay: 100,
    currentDay: 135,
    intervalDays: 30,
    graceDays: 7,
  },
  output: { dueDay: 130, overdueDays: 5, withinGrace: true },
} satisfies ToolExample<Input, Output>;
export const anesthesiaEquipmentInspectionWindowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anesthesiology/anesthesia-equipment-inspection-window",
      title: "Anesthesia Equipment Inspection Window Tool",
      description:
        "Audit an equipment record against supplied inspection timing.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lastInspectionDay: { type: "integer" },
          currentDay: { type: "integer" },
          intervalDays: { type: "integer", minimum: 1 },
          graceDays: { type: "integer", minimum: 0 },
        },
        required: [
          "lastInspectionDay",
          "currentDay",
          "intervalDays",
          "graceDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dueDay: { type: "integer" },
          overdueDays: { type: "integer" },
          withinGrace: { type: "boolean" },
        },
        required: ["dueDay", "overdueDays", "withinGrace"],
      },
      ports: {
        inputs: [
          {
            id: "lastInspectionDay",
            label: "Last Inspection Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "currentDay",
            label: "Current Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "intervalDays",
            label: "Interval Days",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "graceDays",
            label: "Grace Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "dueDay", label: "Due Day", valueType: { type: "integer" } },
          {
            id: "overdueDays",
            label: "Overdue Days",
            valueType: { type: "integer" },
          },
          {
            id: "withinGrace",
            label: "Within Grace",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anesthesiaEquipmentInspectionWindowTool.execute;
export default anesthesiaEquipmentInspectionWindowTool;

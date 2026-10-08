import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outgoingEndMinute: number;
  readonly incomingStartMinute: number;
};
export type Output = {
  readonly overlapMinutes: number;
  readonly uncoveredMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgoingEndMinute: { type: "number" },
    incomingStartMinute: { type: "number" },
  },
  required: ["outgoingEndMinute", "incomingStartMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapMinutes: { type: "number" },
    uncoveredMinutes: { type: "number" },
  },
  required: ["overlapMinutes", "uncoveredMinutes"],
} as const;
/** Calculate supplied emergency staff handover overlap or gap in a shared monotonic minute basis without staffing recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outgoingEndMinute, incomingStartMinute } = request;
  const compute = (): Output => {
    return {
      overlapMinutes: Math.max(0, outgoingEndMinute - incomingStartMinute),
      uncoveredMinutes: Math.max(0, incomingStartMinute - outgoingEndMinute),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outgoingEndMinute: 720, incomingStartMinute: 710 },
  output: { overlapMinutes: 10, uncoveredMinutes: 0 },
} satisfies ToolExample<Input, Output>;
export const emergencyStaffHandoverOverlapMinuteTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "emergency-medicine/emergency-staff-handover-overlap-minute",
      title: "Emergency Staff Handover Overlap Minute Tool",
      description:
        "Calculate supplied emergency staff handover overlap or gap in a shared monotonic minute basis without staffing recommendations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          outgoingEndMinute: { type: "number" },
          incomingStartMinute: { type: "number" },
        },
        required: ["outgoingEndMinute", "incomingStartMinute"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overlapMinutes: { type: "number" },
          uncoveredMinutes: { type: "number" },
        },
        required: ["overlapMinutes", "uncoveredMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "outgoingEndMinute",
            label: "Outgoing End Minute",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "incomingStartMinute",
            label: "Incoming Start Minute",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "overlapMinutes",
            label: "Overlap Minutes",
            valueType: { type: "number" },
          },
          {
            id: "uncoveredMinutes",
            label: "Uncovered Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emergencyStaffHandoverOverlapMinuteTool.execute;
export default emergencyStaffHandoverOverlapMinuteTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registered: number;
  readonly attended: number;
  readonly qualified: number;
};
export type Output = {
  readonly attendanceRate: number;
  readonly qualificationRate: number;
  readonly registeredQualifiedRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registered: { type: "integer", minimum: 1 },
    attended: { type: "integer", minimum: 1 },
    qualified: { type: "integer", minimum: 0 },
  },
  required: ["registered", "attended", "qualified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendanceRate: { type: "number" },
    qualificationRate: { type: "number" },
    registeredQualifiedRate: { type: "number" },
  },
  required: ["attendanceRate", "qualificationRate", "registeredQualifiedRate"],
} as const;
/** Calculate event marketing attended qualified share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registered, attended, qualified } = request;
  const compute = (): Output => {
    H.integer(registered, 1);
    H.integer(attended, 1, registered);
    H.integer(qualified, 0, attended);
    return {
      attendanceRate: attended / registered,
      qualificationRate: qualified / attended,
      registeredQualifiedRate: qualified / registered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registered: 200, attended: 100, qualified: 40 },
  output: {
    attendanceRate: 0.5,
    qualificationRate: 0.4,
    registeredQualifiedRate: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const eventMarketingAttendedQualifiedShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "marketing/event-marketing-attended-qualified-share",
      title: "Event Marketing Attended Qualified Share Tool",
      description:
        "Calculate event marketing attended qualified share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          registered: { type: "integer", minimum: 1 },
          attended: { type: "integer", minimum: 1 },
          qualified: { type: "integer", minimum: 0 },
        },
        required: ["registered", "attended", "qualified"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attendanceRate: { type: "number" },
          qualificationRate: { type: "number" },
          registeredQualifiedRate: { type: "number" },
        },
        required: [
          "attendanceRate",
          "qualificationRate",
          "registeredQualifiedRate",
        ],
      },
      ports: {
        inputs: [
          {
            id: "registered",
            label: "Registered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "qualified",
            label: "Qualified",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "attendanceRate",
            label: "Attendance Rate",
            valueType: { type: "number" },
          },
          {
            id: "qualificationRate",
            label: "Qualification Rate",
            valueType: { type: "number" },
          },
          {
            id: "registeredQualifiedRate",
            label: "Registered Qualified Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = eventMarketingAttendedQualifiedShareTool.execute;
export default eventMarketingAttendedQualifiedShareTool;

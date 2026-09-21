import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attended: number;
  readonly required: number;
  readonly excused: number;
  readonly countExcused: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly attendanceShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attended: { type: "integer", minimum: 0 },
    required: { type: "integer", minimum: 1 },
    excused: { type: "integer", minimum: 0 },
    countExcused: { type: "boolean" },
  },
  required: ["attended", "required", "excused", "countExcused"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    attendanceShare: { type: "number" },
  },
  required: ["denominator", "attendanceShare"],
} as const;
/** Calculate farmer field school session attendance share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attended, required, excused, countExcused } = request;
  const compute = (): Output => {
    H.integer(required, 1);
    H.integer(excused, 0, required - 1);
    H.integer(attended, 0, required - excused);
    return {
      denominator: required - (countExcused ? 0 : excused),
      attendanceShare: attended / (required - (countExcused ? 0 : excused)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attended: 8, required: 12, excused: 2, countExcused: false },
  output: { denominator: 10, attendanceShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const farmerFieldSchoolSessionAttendanceShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/farmer-field-school-session-attendance-share",
      title: "Farmer Field School Session Attendance Share Tool",
      description:
        "Calculate farmer field school session attendance share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attended: { type: "integer", minimum: 0 },
          required: { type: "integer", minimum: 1 },
          excused: { type: "integer", minimum: 0 },
          countExcused: { type: "boolean" },
        },
        required: ["attended", "required", "excused", "countExcused"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          attendanceShare: { type: "number" },
        },
        required: ["denominator", "attendanceShare"],
      },
      ports: {
        inputs: [
          {
            id: "attended",
            label: "Attended",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "required",
            label: "Required",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excused",
            label: "Excused",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "countExcused",
            label: "Count Excused",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "attendanceShare",
            label: "Attendance Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = farmerFieldSchoolSessionAttendanceShareTool.execute;
export default farmerFieldSchoolSessionAttendanceShareTool;

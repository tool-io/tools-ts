import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly overlappingAttendanceMinutes: number;
  readonly observationMinutes: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlappingAttendanceMinutes: { type: "number", minimum: 0 },
    observationMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["overlappingAttendanceMinutes", "observationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate supplied machine-attendance overlap fraction and nonoverlap minutes without allocating labor cost or inferring safe staffing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overlappingAttendanceMinutes, observationMinutes } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observationMinutes) && observationMinutes > 0,
      "observationMinutes",
    ),
      observationMinutes);
    H.domain(
      overlappingAttendanceMinutes >= 0 &&
        overlappingAttendanceMinutes <= observationMinutes,
      "overlappingAttendanceMinutes",
    );
    return {
      fraction: overlappingAttendanceMinutes / observationMinutes,
      remainder: observationMinutes - overlappingAttendanceMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { overlappingAttendanceMinutes: 30, observationMinutes: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const machineAttendanceOverlapFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/machine-attendance-overlap-fraction",
    title: "Machine Attendance Overlap Fraction Tool",
    description:
      "Calculate supplied machine-attendance overlap fraction and nonoverlap minutes without allocating labor cost or inferring safe staffing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlappingAttendanceMinutes: { type: "number", minimum: 0 },
        observationMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["overlappingAttendanceMinutes", "observationMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "overlappingAttendanceMinutes",
          label: "Overlapping Attendance Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observationMinutes",
          label: "Observation Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = machineAttendanceOverlapFractionTool.execute;
export default machineAttendanceOverlapFractionTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attendedMinutes: number;
  readonly sessionMinutes: number;
  readonly sessionCredit: number;
};
export type Output = { readonly credit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendedMinutes: { type: "number", minimum: 0 },
    sessionMinutes: { type: "number", exclusiveMinimum: 0 },
    sessionCredit: { type: "number", minimum: 0 },
  },
  required: ["attendedMinutes", "sessionMinutes", "sessionCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "number" } },
  required: ["credit"],
} as const;
/** Calculate attendance partial session minute credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendedMinutes, sessionMinutes, sessionCredit } = request;
  const compute = (): Output => {
    H.positive(sessionMinutes);
    H.domain(
      attendedMinutes >= 0 &&
        attendedMinutes <= sessionMinutes &&
        sessionCredit >= 0,
    );
    return { credit: (sessionCredit * attendedMinutes) / sessionMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendedMinutes: 45, sessionMinutes: 60, sessionCredit: 2 },
  output: { credit: 1.5 },
} satisfies ToolExample<Input, Output>;
export const attendancePartialSessionMinuteCreditTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/attendance-partial-session-minute-credit",
      title: "Attendance Partial Session Minute Credit Tool",
      description:
        "Calculate attendance partial session minute credit from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          attendedMinutes: { type: "number", minimum: 0 },
          sessionMinutes: { type: "number", exclusiveMinimum: 0 },
          sessionCredit: { type: "number", minimum: 0 },
        },
        required: ["attendedMinutes", "sessionMinutes", "sessionCredit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { credit: { type: "number" } },
        required: ["credit"],
      },
      ports: {
        inputs: [
          {
            id: "attendedMinutes",
            label: "Attended Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sessionMinutes",
            label: "Session Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sessionCredit",
            label: "Session Credit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "credit", label: "Credit", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = attendancePartialSessionMinuteCreditTool.execute;
export default attendancePartialSessionMinuteCreditTool;

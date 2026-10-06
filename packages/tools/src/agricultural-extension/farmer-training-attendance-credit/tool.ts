import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly attendedHours: number;
  readonly suppliedCreditFraction: number;
};
export type Output = { readonly creditedHours: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attendedHours: { type: "number", minimum: 0 },
    suppliedCreditFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["attendedHours", "suppliedCreditFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditedHours: { type: "number" } },
  required: ["creditedHours"],
} as const;
/** Apply an explicit credit fraction to attended training hours without determining accreditation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attendedHours, suppliedCreditFraction } = request;
  const compute = (): Output => {
    H.domain(attendedHours >= 0, "attendedHours");
    (H.domain(
      suppliedCreditFraction >= 0 && suppliedCreditFraction <= 1,
      "suppliedCreditFraction",
    ),
      suppliedCreditFraction);
    return { creditedHours: attendedHours * suppliedCreditFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attendedHours: 12, suppliedCreditFraction: 0.75 },
  output: { creditedHours: 9 },
} satisfies ToolExample<Input, Output>;
export const farmerTrainingAttendanceCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/farmer-training-attendance-credit",
    title: "Farmer Training Attendance Credit",
    description:
      "Apply an explicit credit fraction to attended training hours without determining accreditation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attendedHours: { type: "number", minimum: 0 },
        suppliedCreditFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["attendedHours", "suppliedCreditFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditedHours: { type: "number" } },
      required: ["creditedHours"],
    },
    ports: {
      inputs: [
        {
          id: "attendedHours",
          label: "Attended Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCreditFraction",
          label: "Supplied Credit Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditedHours",
          label: "Credited Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmerTrainingAttendanceCreditTool.execute;
export default farmerTrainingAttendanceCreditTool;

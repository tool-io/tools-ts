import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviceId: string;
  readonly patientRecordId: string;
  readonly assignmentRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    patientRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    assignmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviceId", "patientRecordId", "assignmentRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly asserted device-to-patient assignment without identity resolution or device suitability checks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviceId, patientRecordId, assignmentRecordId } = request;
  const compute = (): Output => {
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(patientRecordId.length > 0, "patientRecordId");
    H.domain(assignmentRecordId.length > 0, "assignmentRecordId");
    return {
      token: JSON.stringify([deviceId, patientRecordId, assignmentRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deviceId: "D17",
    patientRecordId: "P3",
    assignmentRecordId: "ASSIGN2",
  },
  output: { token: '["D17","P3","ASSIGN2"]' },
} satisfies ToolExample<Input, Output>;
export const nursingDevicePatientAssignmentTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nursing-device-patient-assignment-tag",
    title: "Nursing Device Patient Assignment Tag",
    description:
      "Record an explicitly asserted device-to-patient assignment without identity resolution or device suitability checks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        patientRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        assignmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviceId", "patientRecordId", "assignmentRecordId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "deviceId",
          label: "Device Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "patientRecordId",
          label: "Patient Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignmentRecordId",
          label: "Assignment Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = nursingDevicePatientAssignmentTagTool.execute;
export default nursingDevicePatientAssignmentTagTool;

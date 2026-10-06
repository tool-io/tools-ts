import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sensorId: string;
  readonly recordedCleaningDate: string;
  readonly cleaningRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensorId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCleaningDate: { type: "string", maxLength: 8192, minLength: 1 },
    cleaningRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sensorId", "recordedCleaningDate", "cleaningRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit sensor cleaning-date metadata without selecting or validating cleaning procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sensorId, recordedCleaningDate, cleaningRecordId } = request;
  const compute = (): Output => {
    H.domain(sensorId.length > 0, "sensorId");
    H.domain(recordedCleaningDate.length > 0, "recordedCleaningDate");
    H.domain(cleaningRecordId.length > 0, "cleaningRecordId");
    return {
      token: JSON.stringify([sensorId, recordedCleaningDate, cleaningRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sensorId: "S17",
    recordedCleaningDate: "2026-11-01",
    cleaningRecordId: "CL2",
  },
  output: { token: '["S17","2026-11-01","CL2"]' },
} satisfies ToolExample<Input, Output>;
export const aquaponicSensorCleaningDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaponics", "agriculture"],
      keywords: ["aquaponics", "agriculture"],
    },
    id: "aquaponics/aquaponic-sensor-cleaning-date-label",
    title: "Aquaponic Sensor Cleaning Date Label",
    description:
      "Preserve explicit sensor cleaning-date metadata without selecting or validating cleaning procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sensorId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCleaningDate: { type: "string", maxLength: 8192, minLength: 1 },
        cleaningRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sensorId", "recordedCleaningDate", "cleaningRecordId"],
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
          id: "sensorId",
          label: "Sensor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCleaningDate",
          label: "Recorded Cleaning Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cleaningRecordId",
          label: "Cleaning Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = aquaponicSensorCleaningDateLabelTool.execute;
export default aquaponicSensorCleaningDateLabelTool;

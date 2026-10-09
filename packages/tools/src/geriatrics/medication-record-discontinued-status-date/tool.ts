import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly medicationRecordId: string;
  readonly suppliedStatus: string;
  readonly statusDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medicationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
    statusDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["medicationRecordId", "suppliedStatus", "statusDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit medication record status and date transcription without treatment or medication-use advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { medicationRecordId, suppliedStatus, statusDateText } = request;
  const compute = (): Output => {
    H.domain(medicationRecordId.length > 0, "medicationRecordId");
    H.domain(suppliedStatus.length > 0, "suppliedStatus");
    H.domain(statusDateText.length > 0, "statusDateText");
    return {
      token: JSON.stringify([
        medicationRecordId,
        suppliedStatus,
        statusDateText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    medicationRecordId: "M17",
    suppliedStatus: "discontinued",
    statusDateText: "2026-11-01",
  },
  output: { token: '["M17","discontinued","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const medicationRecordDiscontinuedStatusDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geriatrics/medication-record-discontinued-status-date",
      title: "Medication Record Discontinued Status Date Tool",
      description:
        "Preserve an explicit medication record status and date transcription without treatment or medication-use advice.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          medicationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedStatus: { type: "string", maxLength: 8192, minLength: 1 },
          statusDateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["medicationRecordId", "suppliedStatus", "statusDateText"],
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
            id: "medicationRecordId",
            label: "Medication Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedStatus",
            label: "Supplied Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "statusDateText",
            label: "Status Date Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = medicationRecordDiscontinuedStatusDateTool.execute;
export default medicationRecordDiscontinuedStatusDateTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedLineNumber: number;
  readonly regimenWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedLineNumber: { type: "integer", minimum: 1 },
    regimenWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "recordedLineNumber", "regimenWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly assigned line-of-therapy ordinal and regimen wording without determining treatment sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedLineNumber, regimenWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && regimenWording.length > 0, "recordId");
    (H.domain(
      Number.isSafeInteger(recordedLineNumber) &&
        recordedLineNumber >= 1 &&
        recordedLineNumber <= Number.MAX_SAFE_INTEGER,
      "recordedLineNumber",
    ),
      recordedLineNumber);
    return {
      token: JSON.stringify([recordId, recordedLineNumber, regimenWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    recordedLineNumber: 2,
    regimenWording: "Regimen A",
  },
  output: { token: '["R17",2,"Regimen A"]' },
} satisfies ToolExample<Input, Output>;
export const oncologyLineOfTherapyRecordTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/oncology-line-of-therapy-record-token",
    title: "Oncology Line Of Therapy Record Token",
    description:
      "Record an explicitly assigned line-of-therapy ordinal and regimen wording without determining treatment sequence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedLineNumber: { type: "integer", minimum: 1 },
        regimenWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "recordedLineNumber", "regimenWording"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedLineNumber",
          label: "Recorded Line Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "regimenWording",
          label: "Regimen Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oncologyLineOfTherapyRecordTokenTool.execute;
export default oncologyLineOfTherapyRecordTokenTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly correctionReference: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    correctionReference: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "correctionReference", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit clinical-record correction reference by source version without changing source records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, correctionReference, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(correctionReference.length > 0, "correctionReference");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([recordId, correctionReference, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", correctionReference: "COR2", sourceVersion: "v2" },
  output: { token: '["R17","COR2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalRecordSourceCorrectionMarkerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "clinical-research",
          "clinical research",
          "research and quality management",
        ],
        keywords: ["clinical research", "research and quality management"],
      },
      id: "clinical-research/clinical-record-source-correction-marker",
      title: "Clinical Record Source Correction Marker",
      description:
        "Qualify an explicit clinical-record correction reference by source version without changing source records.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          correctionReference: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "correctionReference", "sourceVersion"],
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
            id: "correctionReference",
            label: "Correction Reference",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
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
export const run = clinicalRecordSourceCorrectionMarkerTool.execute;
export default clinicalRecordSourceCorrectionMarkerTool;

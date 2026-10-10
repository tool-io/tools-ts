import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchId: string;
  readonly releaseRecordId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    releaseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["batchId", "releaseRecordId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit pharmacy batch-release reference by version without deciding batch release. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, releaseRecordId, version } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(releaseRecordId.length > 0, "releaseRecordId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([batchId, releaseRecordId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchId: "B17", releaseRecordId: "REL2", version: "v2" },
  output: { token: '["B17","REL2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const hospitalpharmacyBatchReleaseReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
        keywords: ["hospital pharmacy", "pharmacy"],
      },
      id: "hospital-pharmacy/hospital-pharmacy-batch-release-reference",
      title: "Hospital Pharmacy Batch Release Reference",
      description:
        "Qualify an explicit pharmacy batch-release reference by version without deciding batch release.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          batchId: { type: "string", maxLength: 8192, minLength: 1 },
          releaseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          version: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["batchId", "releaseRecordId", "version"],
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
            id: "batchId",
            label: "Batch Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "releaseRecordId",
            label: "Release Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
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
export const run = hospitalpharmacyBatchReleaseReferenceTool.execute;
export default hospitalpharmacyBatchReleaseReferenceTool;

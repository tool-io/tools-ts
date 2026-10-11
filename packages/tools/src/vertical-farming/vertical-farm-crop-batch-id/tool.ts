import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly facilityId: string;
  readonly cropCode: string;
  readonly batchCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    facilityId: { type: "string", maxLength: 8192, minLength: 1 },
    cropCode: { type: "string", maxLength: 8192, minLength: 1 },
    batchCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["facilityId", "cropCode", "batchCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous crop-batch key from supplied facility, crop, and batch codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { facilityId, cropCode, batchCode } = request;
  const compute = (): Output => {
    H.domain(facilityId.length > 0, "facilityId");
    H.domain(cropCode.length > 0, "cropCode");
    H.domain(batchCode.length > 0, "batchCode");
    return { token: JSON.stringify([facilityId, cropCode, batchCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { facilityId: "FAC17", cropCode: "CROP2", batchCode: "B2" },
  output: { token: '["FAC17","CROP2","B2"]' },
} satisfies ToolExample<Input, Output>;
export const verticalFarmCropBatchIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/vertical-farm-crop-batch-id",
    title: "Vertical Farm Crop Batch ID",
    description:
      "Build an unambiguous crop-batch key from supplied facility, crop, and batch codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        facilityId: { type: "string", maxLength: 8192, minLength: 1 },
        cropCode: { type: "string", maxLength: 8192, minLength: 1 },
        batchCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["facilityId", "cropCode", "batchCode"],
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
          id: "facilityId",
          label: "Facility Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cropCode",
          label: "Crop Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "batchCode",
          label: "Batch Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = verticalFarmCropBatchIdTool.execute;
export default verticalFarmCropBatchIdTool;

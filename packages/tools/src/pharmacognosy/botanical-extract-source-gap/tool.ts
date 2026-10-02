import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIds: readonly string[];
  readonly voucherIds: readonly string[];
  readonly extractionRecordIds: readonly string[];
  readonly verifiedVoucherIds: readonly string[];
};
export type Output = {
  readonly missingVoucher: number;
  readonly missingExtractionRecord: number;
  readonly verifiedVoucherRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    voucherIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    extractionRecordIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    verifiedVoucherIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "sampleIds",
    "voucherIds",
    "extractionRecordIds",
    "verifiedVoucherIds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingVoucher: { type: "integer" },
    missingExtractionRecord: { type: "integer" },
    verifiedVoucherRecords: { type: "integer" },
  },
  required: [
    "missingVoucher",
    "missingExtractionRecord",
    "verifiedVoucherRecords",
  ],
} as const;
/** Inspect explicit botanical extract provenance records without inferring identity or bioactivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleIds, voucherIds, extractionRecordIds, verifiedVoucherIds } =
    request;
  const compute = (): Output => {
    H.sameLength(sampleIds, voucherIds);
    H.sameLength(sampleIds, extractionRecordIds);
    return {
      missingVoucher: voucherIds.filter((x) => x.length === 0).length,
      missingExtractionRecord: extractionRecordIds.filter((x) => x.length === 0)
        .length,
      verifiedVoucherRecords: voucherIds.filter(
        (x) => x.length > 0 && verifiedVoucherIds.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIds: ["a", "b"],
    voucherIds: ["v1", ""],
    extractionRecordIds: ["e1", "e2"],
    verifiedVoucherIds: ["v1"],
  },
  output: {
    missingVoucher: 1,
    missingExtractionRecord: 0,
    verifiedVoucherRecords: 1,
  },
} satisfies ToolExample<Input, Output>;
export const botanicalExtractSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/botanical-extract-source-gap",
    title: "Botanical Extract Source Gap Tool",
    description:
      "Inspect explicit botanical extract provenance records without inferring identity or bioactivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        voucherIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        extractionRecordIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        verifiedVoucherIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "sampleIds",
        "voucherIds",
        "extractionRecordIds",
        "verifiedVoucherIds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingVoucher: { type: "integer" },
        missingExtractionRecord: { type: "integer" },
        verifiedVoucherRecords: { type: "integer" },
      },
      required: [
        "missingVoucher",
        "missingExtractionRecord",
        "verifiedVoucherRecords",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sampleIds",
          label: "Sample Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "voucherIds",
          label: "Voucher Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "extractionRecordIds",
          label: "Extraction Record Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "verifiedVoucherIds",
          label: "Verified Voucher Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingVoucher",
          label: "Missing Voucher",
          valueType: { type: "integer" },
        },
        {
          id: "missingExtractionRecord",
          label: "Missing Extraction Record",
          valueType: { type: "integer" },
        },
        {
          id: "verifiedVoucherRecords",
          label: "Verified Voucher Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = botanicalExtractSourceGapTool.execute;
export default botanicalExtractSourceGapTool;

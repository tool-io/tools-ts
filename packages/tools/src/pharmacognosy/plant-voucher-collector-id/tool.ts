import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voucherId: string;
  readonly collectorId: string;
  readonly collectionRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voucherId: { type: "string", maxLength: 8192, minLength: 1 },
    collectorId: { type: "string", maxLength: 8192, minLength: 1 },
    collectionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["voucherId", "collectorId", "collectionRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit plant voucher by collector and collection-record identifiers without authenticating identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voucherId, collectorId, collectionRecordId } = request;
  const compute = (): Output => {
    H.domain(voucherId.length > 0, "voucherId");
    H.domain(collectorId.length > 0, "collectorId");
    H.domain(collectionRecordId.length > 0, "collectionRecordId");
    return {
      token: JSON.stringify([voucherId, collectorId, collectionRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voucherId: "V17", collectorId: "C2", collectionRecordId: "COL3" },
  output: { token: '["V17","C2","COL3"]' },
} satisfies ToolExample<Input, Output>;
export const plantVoucherCollectorIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/plant-voucher-collector-id",
    title: "Plant Voucher Collector ID",
    description:
      "Qualify an explicit plant voucher by collector and collection-record identifiers without authenticating identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voucherId: { type: "string", maxLength: 8192, minLength: 1 },
        collectorId: { type: "string", maxLength: 8192, minLength: 1 },
        collectionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["voucherId", "collectorId", "collectionRecordId"],
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
          id: "voucherId",
          label: "Voucher Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectorId",
          label: "Collector Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionRecordId",
          label: "Collection Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = plantVoucherCollectorIdTool.execute;
export default plantVoucherCollectorIdTool;

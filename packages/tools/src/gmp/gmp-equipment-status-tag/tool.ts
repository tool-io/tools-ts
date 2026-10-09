import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentId: string;
  readonly statusWording: string;
  readonly sourceRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    statusWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["equipmentId", "statusWording", "sourceRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit equipment status record without determining equipment readiness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equipmentId, statusWording, sourceRecordId } = request;
  const compute = (): Output => {
    H.domain(equipmentId.length > 0, "equipmentId");
    H.domain(statusWording.length > 0, "statusWording");
    H.domain(sourceRecordId.length > 0, "sourceRecordId");
    return {
      token: JSON.stringify([equipmentId, statusWording, sourceRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    equipmentId: "EQ17",
    statusWording: "awaiting review",
    sourceRecordId: "REC2",
  },
  output: { token: '["EQ17","awaiting review","REC2"]' },
} satisfies ToolExample<Input, Output>;
export const gmpEquipmentStatusTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-equipment-status-tag",
    title: "GMP Equipment Status Tag",
    description:
      "Qualify an explicit equipment status record without determining equipment readiness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        statusWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["equipmentId", "statusWording", "sourceRecordId"],
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
          id: "equipmentId",
          label: "Equipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "statusWording",
          label: "Status Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRecordId",
          label: "Source Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gmpEquipmentStatusTagTool.execute;
export default gmpEquipmentStatusTagTool;

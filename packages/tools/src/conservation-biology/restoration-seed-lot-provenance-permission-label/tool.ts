import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seedlotId: string;
  readonly provenanceSource: string;
  readonly permissionRecord: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seedlotId: { type: "string", maxLength: 8192, minLength: 1 },
    provenanceSource: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecord: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["seedlotId", "provenanceSource", "permissionRecord"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit restoration seedlot provenance and permission references without validating origin or release suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seedlotId, provenanceSource, permissionRecord } = request;
  const compute = (): Output => {
    H.domain(seedlotId.length > 0, "seedlotId");
    H.domain(provenanceSource.length > 0, "provenanceSource");
    H.domain(permissionRecord.length > 0, "permissionRecord");
    return {
      token: JSON.stringify([seedlotId, provenanceSource, permissionRecord]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seedlotId: "S17",
    provenanceSource: "collection C4",
    permissionRecord: "permit P2",
  },
  output: { token: '["S17","collection C4","permit P2"]' },
} satisfies ToolExample<Input, Output>;
export const restorationSeedlotProvenancePermissionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["conservation-biology", "conservation biology", "biology"],
        keywords: ["conservation biology", "biology"],
      },
      id: "conservation-biology/restoration-seed-lot-provenance-permission-label",
      title: "Restoration Seed Lot Provenance Permission Label",
      description:
        "Record explicit restoration seedlot provenance and permission references without validating origin or release suitability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seedlotId: { type: "string", maxLength: 8192, minLength: 1 },
          provenanceSource: { type: "string", maxLength: 8192, minLength: 1 },
          permissionRecord: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["seedlotId", "provenanceSource", "permissionRecord"],
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
            id: "seedlotId",
            label: "Seedlot Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "provenanceSource",
            label: "Provenance Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionRecord",
            label: "Permission Record",
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
export const run = restorationSeedlotProvenancePermissionLabelTool.execute;
export default restorationSeedlotProvenancePermissionLabelTool;

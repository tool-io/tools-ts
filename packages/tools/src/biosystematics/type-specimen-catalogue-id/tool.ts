import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly institutionCode: string;
  readonly collectionCode: string;
  readonly catalogueNumber: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    institutionCode: { type: "string", maxLength: 8192, minLength: 1 },
    collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    catalogueNumber: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["institutionCode", "collectionCode", "catalogueNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous specimen catalogue key from supplied institutional fields while preserving leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { institutionCode, collectionCode, catalogueNumber } = request;
  const compute = (): Output => {
    H.domain(institutionCode.length > 0, "institutionCode");
    H.domain(collectionCode.length > 0, "collectionCode");
    H.domain(catalogueNumber.length > 0, "catalogueNumber");
    return {
      token: JSON.stringify([institutionCode, collectionCode, catalogueNumber]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    institutionCode: "INST17",
    collectionCode: "COL2",
    catalogueNumber: "00042",
  },
  output: { token: '["INST17","COL2","00042"]' },
} satisfies ToolExample<Input, Output>;
export const typeSpecimenCatalogueIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/type-specimen-catalogue-id",
    title: "Type Specimen Catalogue ID",
    description:
      "Build an unambiguous specimen catalogue key from supplied institutional fields while preserving leading zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        institutionCode: { type: "string", maxLength: 8192, minLength: 1 },
        collectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        catalogueNumber: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["institutionCode", "collectionCode", "catalogueNumber"],
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
          id: "institutionCode",
          label: "Institution Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "collectionCode",
          label: "Collection Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "catalogueNumber",
          label: "Catalogue Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = typeSpecimenCatalogueIdTool.execute;
export default typeSpecimenCatalogueIdTool;

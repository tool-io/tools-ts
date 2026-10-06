import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exhibitionId: string;
  readonly catalogueEdition: string;
  readonly objectNumberText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exhibitionId: { type: "string", maxLength: 8192, minLength: 1 },
    catalogueEdition: { type: "string", maxLength: 8192, minLength: 1 },
    objectNumberText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["exhibitionId", "catalogueEdition", "objectNumberText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit exhibition object number by catalogue edition while preserving leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exhibitionId, catalogueEdition, objectNumberText } = request;
  const compute = (): Output => {
    H.domain(exhibitionId.length > 0, "exhibitionId");
    H.domain(catalogueEdition.length > 0, "catalogueEdition");
    H.domain(objectNumberText.length > 0, "objectNumberText");
    return {
      token: JSON.stringify([exhibitionId, catalogueEdition, objectNumberText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exhibitionId: "EX17",
    catalogueEdition: "v2",
    objectNumberText: "042",
  },
  output: { token: '["EX17","v2","042"]' },
} satisfies ToolExample<Input, Output>;
export const exhibitionCatalogueObjectNumberTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["art-history", "art history", "arts and design"],
        keywords: ["art history", "arts and design"],
      },
      id: "art-history/exhibition-catalogue-object-number-token",
      title: "Exhibition Catalogue Object Number Token",
      description:
        "Qualify an explicit exhibition object number by catalogue edition while preserving leading zeros.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exhibitionId: { type: "string", maxLength: 8192, minLength: 1 },
          catalogueEdition: { type: "string", maxLength: 8192, minLength: 1 },
          objectNumberText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["exhibitionId", "catalogueEdition", "objectNumberText"],
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
            id: "exhibitionId",
            label: "Exhibition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "catalogueEdition",
            label: "Catalogue Edition",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "objectNumberText",
            label: "Object Number Text",
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
export const run = exhibitionCatalogueObjectNumberTokenTool.execute;
export default exhibitionCatalogueObjectNumberTokenTool;

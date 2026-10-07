import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly substrateUnit: string;
  readonly productUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    substrateUnit: { type: "string", maxLength: 8192, minLength: 1 },
    productUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "substrateUnit", "productUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit assay substrate and product unit wording without asserting stoichiometric equivalence or conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, substrateUnit, productUnit } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(substrateUnit.length > 0, "substrateUnit");
    H.domain(productUnit.length > 0, "productUnit");
    return { token: JSON.stringify([assayId, substrateUnit, productUnit]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assayId: "A17", substrateUnit: "mmol/L", productUnit: "mmol/L" },
  output: { token: '["A17","mmol/L","mmol/L"]' },
} satisfies ToolExample<Input, Output>;
export const benignAssaySubstrateProductUnitPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biotechnology", "biology"],
        keywords: ["biotechnology", "biology"],
      },
      id: "biotechnology/benign-assay-substrate-product-unit-pair",
      title: "Benign Assay Substrate Product Unit Pair",
      description:
        "Preserve explicit assay substrate and product unit wording without asserting stoichiometric equivalence or conversion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assayId: { type: "string", maxLength: 8192, minLength: 1 },
          substrateUnit: { type: "string", maxLength: 8192, minLength: 1 },
          productUnit: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["assayId", "substrateUnit", "productUnit"],
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
            id: "assayId",
            label: "Assay Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "substrateUnit",
            label: "Substrate Unit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "productUnit",
            label: "Product Unit",
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
export const run = benignAssaySubstrateProductUnitPairTool.execute;
export default benignAssaySubstrateProductUnitPairTool;

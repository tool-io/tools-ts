import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productIds: readonly string[];
  readonly labelEdition: readonly string[];
  readonly sourceEdition: readonly string[];
  readonly ingredientListMatched: readonly boolean[];
};
export type Output = {
  readonly editionMismatches: number;
  readonly ingredientMismatches: number;
  readonly fullyMatchedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    labelEdition: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceEdition: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ingredientListMatched: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "productIds",
    "labelEdition",
    "sourceEdition",
    "ingredientListMatched",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionMismatches: { type: "integer" },
    ingredientMismatches: { type: "integer" },
    fullyMatchedRecords: { type: "integer" },
  },
  required: [
    "editionMismatches",
    "ingredientMismatches",
    "fullyMatchedRecords",
  ],
} as const;
/** Compare explicit public product label provenance without inferring efficacy or safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productIds, labelEdition, sourceEdition, ingredientListMatched } =
    request;
  const compute = (): Output => {
    H.sameLength(productIds, labelEdition);
    H.sameLength(productIds, sourceEdition);
    H.sameLength(productIds, ingredientListMatched);
    return {
      editionMismatches: labelEdition.filter((x, i) => x !== sourceEdition[i])
        .length,
      ingredientMismatches: ingredientListMatched.filter((x) => !x).length,
      fullyMatchedRecords: productIds.filter(
        (x, i) =>
          labelEdition[i] === sourceEdition[i] && ingredientListMatched[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productIds: ["a", "b"],
    labelEdition: ["v1", "v2"],
    sourceEdition: ["v1", "v1"],
    ingredientListMatched: [true, false],
  },
  output: {
    editionMismatches: 1,
    ingredientMismatches: 1,
    fullyMatchedRecords: 1,
  },
} satisfies ToolExample<Input, Output>;
export const publicProductSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/public-product-source-gap",
    title: "Public Product Source Gap Tool",
    description:
      "Compare explicit public product label provenance without inferring efficacy or safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        labelEdition: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceEdition: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ingredientListMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "productIds",
        "labelEdition",
        "sourceEdition",
        "ingredientListMatched",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionMismatches: { type: "integer" },
        ingredientMismatches: { type: "integer" },
        fullyMatchedRecords: { type: "integer" },
      },
      required: [
        "editionMismatches",
        "ingredientMismatches",
        "fullyMatchedRecords",
      ],
    },
    ports: {
      inputs: [
        {
          id: "productIds",
          label: "Product Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "labelEdition",
          label: "Label Edition",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "ingredientListMatched",
          label: "Ingredient List Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "editionMismatches",
          label: "Edition Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "ingredientMismatches",
          label: "Ingredient Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "fullyMatchedRecords",
          label: "Fully Matched Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicProductSourceGapTool.execute;
export default publicProductSourceGapTool;

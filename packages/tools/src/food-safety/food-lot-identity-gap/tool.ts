import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotIds: readonly string[];
  readonly sourceLotIds: readonly string[];
  readonly productIds: readonly string[];
  readonly sourceProductIds: readonly string[];
};
export type Output = {
  readonly lotMismatches: number;
  readonly productMismatches: number;
  readonly jointMatches: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceLotIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    productIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceProductIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["lotIds", "sourceLotIds", "productIds", "sourceProductIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotMismatches: { type: "integer" },
    productMismatches: { type: "integer" },
    jointMatches: { type: "integer" },
  },
  required: ["lotMismatches", "productMismatches", "jointMatches"],
} as const;
/** Compare explicit traceability identifiers without inferring food safety or release status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotIds, sourceLotIds, productIds, sourceProductIds } = request;
  const compute = (): Output => {
    H.sameLength(lotIds, sourceLotIds);
    H.sameLength(lotIds, productIds);
    H.sameLength(lotIds, sourceProductIds);
    return {
      lotMismatches: lotIds.filter((x, i) => x !== sourceLotIds[i]).length,
      productMismatches: productIds.filter((x, i) => x !== sourceProductIds[i])
        .length,
      jointMatches: lotIds.filter(
        (x, i) =>
          x === sourceLotIds[i] && productIds[i] === sourceProductIds[i],
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lotIds: ["L1", "L2"],
    sourceLotIds: ["L1", "L1"],
    productIds: ["P1", "P2"],
    sourceProductIds: ["P1", "P2"],
  },
  output: { lotMismatches: 1, productMismatches: 0, jointMatches: 1 },
} satisfies ToolExample<Input, Output>;
export const foodLotIdentityGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "food-safety/food-lot-identity-gap",
    title: "Food Lot Identity Gap Tool",
    description:
      "Compare explicit traceability identifiers without inferring food safety or release status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceLotIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        productIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceProductIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["lotIds", "sourceLotIds", "productIds", "sourceProductIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotMismatches: { type: "integer" },
        productMismatches: { type: "integer" },
        jointMatches: { type: "integer" },
      },
      required: ["lotMismatches", "productMismatches", "jointMatches"],
    },
    ports: {
      inputs: [
        {
          id: "lotIds",
          label: "Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceLotIds",
          label: "Source Lot Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "productIds",
          label: "Product Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceProductIds",
          label: "Source Product Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "lotMismatches",
          label: "Lot Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "productMismatches",
          label: "Product Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "jointMatches",
          label: "Joint Matches",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodLotIdentityGapTool.execute;
export default foodLotIdentityGapTool;

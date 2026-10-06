import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly suppliedNutrientWording: string;
  readonly reportingBasis: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedNutrientWording: { type: "string", maxLength: 8192, minLength: 1 },
    reportingBasis: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "suppliedNutrientWording", "reportingBasis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit nutrient and reporting-basis label without converting oxide equivalents or selecting fertilizer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, suppliedNutrientWording, reportingBasis } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(suppliedNutrientWording.length > 0, "suppliedNutrientWording");
    H.domain(reportingBasis.length > 0, "reportingBasis");
    return {
      token: JSON.stringify([
        productId,
        suppliedNutrientWording,
        reportingBasis,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "PR17",
    suppliedNutrientWording: "P2O5",
    reportingBasis: "oxide label",
  },
  output: { token: '["PR17","P2O5","oxide label"]' },
} satisfies ToolExample<Input, Output>;
export const fertilizerOxideElementLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/fertilizer-oxide-element-label",
    title: "Fertilizer Oxide Element Label",
    description:
      "Preserve an explicit nutrient and reporting-basis label without converting oxide equivalents or selecting fertilizer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedNutrientWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        reportingBasis: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "suppliedNutrientWording", "reportingBasis"],
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
          id: "productId",
          label: "Product Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedNutrientWording",
          label: "Supplied Nutrient Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportingBasis",
          label: "Reporting Basis",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fertilizerOxideElementLabelTool.execute;
export default fertilizerOxideElementLabelTool;

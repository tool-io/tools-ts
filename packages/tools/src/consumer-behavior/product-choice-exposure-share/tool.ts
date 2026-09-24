import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productIds: readonly string[];
  readonly exposureWeights: readonly number[];
  readonly chosen: readonly boolean[];
  readonly selectedProduct: string;
};
export type Output = {
  readonly productExposure: number;
  readonly chosenExposure: number;
  readonly choiceShare: number;
  readonly defined: boolean;
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
    exposureWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    chosen: { type: "array", maxItems: 256, items: { type: "boolean" } },
    selectedProduct: { type: "string", maxLength: 8192 },
  },
  required: ["productIds", "exposureWeights", "chosen", "selectedProduct"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productExposure: { type: "number" },
    chosenExposure: { type: "number" },
    choiceShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["productExposure", "chosenExposure", "choiceShare", "defined"],
} as const;
/** Calculate product choice exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productIds, exposureWeights, chosen, selectedProduct } = request;
  const compute = (): Output => {
    H.sameLength(productIds, exposureWeights);
    H.sameLength(productIds, chosen);
    H.domain(exposureWeights.every((x) => x >= 0));
    return (() => {
      const productExposure = exposureWeights.reduce(
          (s, x, i) => s + (productIds[i] === selectedProduct ? x : 0),
          0,
        ),
        chosenExposure = exposureWeights.reduce(
          (s, x, i) =>
            s + (productIds[i] === selectedProduct && chosen[i] ? x : 0),
          0,
        );
      return {
        productExposure,
        chosenExposure,
        choiceShare: productExposure > 0 ? chosenExposure / productExposure : 0,
        defined: productExposure > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productIds: ["A", "A", "B"],
    exposureWeights: [2, 3, 4],
    chosen: [true, false, true],
    selectedProduct: "A",
  },
  output: {
    productExposure: 5,
    chosenExposure: 2,
    choiceShare: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const productChoiceExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "consumer-behavior/product-choice-exposure-share",
    title: "Product Choice Exposure Share Tool",
    description:
      "Calculate product choice exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exposureWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        chosen: { type: "array", maxItems: 256, items: { type: "boolean" } },
        selectedProduct: { type: "string", maxLength: 8192 },
      },
      required: ["productIds", "exposureWeights", "chosen", "selectedProduct"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productExposure: { type: "number" },
        chosenExposure: { type: "number" },
        choiceShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["productExposure", "chosenExposure", "choiceShare", "defined"],
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
          id: "exposureWeights",
          label: "Exposure Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "chosen",
          label: "Chosen",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "selectedProduct",
          label: "Selected Product",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "productExposure",
          label: "Product Exposure",
          valueType: { type: "number" },
        },
        {
          id: "chosenExposure",
          label: "Chosen Exposure",
          valueType: { type: "number" },
        },
        {
          id: "choiceShare",
          label: "Choice Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = productChoiceExposureShareTool.execute;
export default productChoiceExposureShareTool;

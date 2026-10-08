import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly positionOneBased: number;
};
export type Output = { readonly positionLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    positionOneBased: { type: "integer", minimum: 1 },
  },
  required: ["productId", "positionOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { positionLabel: { type: "string", maxLength: 8192 } },
  required: ["positionLabel"],
} as const;
/** Label an explicitly supplied product choice display position without inferring preference or randomizing order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, positionOneBased } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    (H.domain(
      Number.isSafeInteger(positionOneBased) &&
        positionOneBased >= 1 &&
        positionOneBased <= Number.MAX_SAFE_INTEGER,
      "positionOneBased",
    ),
      positionOneBased);
    return {
      positionLabel: productId + " [position " + positionOneBased + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productId: "P17", positionOneBased: 3 },
  output: { positionLabel: "P17 [position 3]" },
} satisfies ToolExample<Input, Output>;
export const productChoiceOrderPositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/product-choice-order-position-label",
    title: "Product Choice Order Position Label",
    description:
      "Label an explicitly supplied product choice display position without inferring preference or randomizing order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        positionOneBased: { type: "integer", minimum: 1 },
      },
      required: ["productId", "positionOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { positionLabel: { type: "string", maxLength: 8192 } },
      required: ["positionLabel"],
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
          id: "positionOneBased",
          label: "Position One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "positionLabel",
          label: "Position Label",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = productChoiceOrderPositionLabelTool.execute;
export default productChoiceOrderPositionLabelTool;

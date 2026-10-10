import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly botanicalName: string;
  readonly partWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    botanicalName: { type: "string", maxLength: 8192, minLength: 1 },
    partWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "botanicalName", "partWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit product botanical-name and plant-part label without authenticating composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, botanicalName, partWording } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(botanicalName.length > 0, "botanicalName");
    H.domain(partWording.length > 0, "partWording");
    return { token: JSON.stringify([productId, botanicalName, partWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productId: "PR17", botanicalName: "Plant A", partWording: "leaf" },
  output: { token: '["PR17","Plant A","leaf"]' },
} satisfies ToolExample<Input, Output>;
export const naturopathyProductBotanicalpartLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["naturopathy", "health and medicine"],
        keywords: ["naturopathy", "health and medicine"],
      },
      id: "naturopathy/naturopathy-product-botanical-part-label",
      title: "Naturopathy Product Botanical Part Label",
      description:
        "Preserve an explicit product botanical-name and plant-part label without authenticating composition.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productId: { type: "string", maxLength: 8192, minLength: 1 },
          botanicalName: { type: "string", maxLength: 8192, minLength: 1 },
          partWording: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["productId", "botanicalName", "partWording"],
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
            id: "botanicalName",
            label: "Botanical Name",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "partWording",
            label: "Part Wording",
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
export const run = naturopathyProductBotanicalpartLabelTool.execute;
export default naturopathyProductBotanicalpartLabelTool;

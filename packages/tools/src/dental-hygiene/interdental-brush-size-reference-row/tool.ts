import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly suppliedSizeText: string;
  readonly referenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSizeText: { type: "string", maxLength: 8192, minLength: 1 },
    referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "suppliedSizeText", "referenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied interdental-brush size and source without recommending products or equating size systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, suppliedSizeText, referenceSource } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(suppliedSizeText.length > 0, "suppliedSizeText");
    H.domain(referenceSource.length > 0, "referenceSource");
    return {
      token: JSON.stringify([productId, suppliedSizeText, referenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    productId: "P17",
    suppliedSizeText: "size 2",
    referenceSource: "manufacturer chart C4",
  },
  output: { token: '["P17","size 2","manufacturer chart C4"]' },
} satisfies ToolExample<Input, Output>;
export const interdentalBrushSizeReferenceRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/interdental-brush-size-reference-row",
    title: "Interdental Brush Size Reference Row Tool",
    description:
      "Record a supplied interdental-brush size and source without recommending products or equating size systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSizeText: { type: "string", maxLength: 8192, minLength: 1 },
        referenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "suppliedSizeText", "referenceSource"],
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
          id: "suppliedSizeText",
          label: "Supplied Size Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceSource",
          label: "Reference Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = interdentalBrushSizeReferenceRowTool.execute;
export default interdentalBrushSizeReferenceRowTool;

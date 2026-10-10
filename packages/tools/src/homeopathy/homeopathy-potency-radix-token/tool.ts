import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productId: string;
  readonly printedPotency: string;
  readonly printedRadix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productId: { type: "string", maxLength: 8192, minLength: 1 },
    printedPotency: { type: "string", maxLength: 8192, minLength: 1 },
    printedRadix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["productId", "printedPotency", "printedRadix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve printed potency and radix wording without inferring composition or efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productId, printedPotency, printedRadix } = request;
  const compute = (): Output => {
    H.domain(productId.length > 0, "productId");
    H.domain(printedPotency.length > 0, "printedPotency");
    H.domain(printedRadix.length > 0, "printedRadix");
    return { token: JSON.stringify([productId, printedPotency, printedRadix]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productId: "PR17", printedPotency: "6X", printedRadix: "X" },
  output: { token: '["PR17","6X","X"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathyPotencyRadixTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-potency-radix-token",
    title: "Homeopathy Potency Radix Token",
    description:
      "Preserve printed potency and radix wording without inferring composition or efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        productId: { type: "string", maxLength: 8192, minLength: 1 },
        printedPotency: { type: "string", maxLength: 8192, minLength: 1 },
        printedRadix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["productId", "printedPotency", "printedRadix"],
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
          id: "printedPotency",
          label: "Printed Potency",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "printedRadix",
          label: "Printed Radix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeopathyPotencyRadixTokenTool.execute;
export default homeopathyPotencyRadixTokenTool;

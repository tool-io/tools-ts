import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly threshold: number;
  readonly equalityToHigher: boolean;
};
export type Output = { readonly tier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    threshold: { type: "number", minimum: 0 },
    equalityToHigher: { type: "boolean" },
  },
  required: ["quantity", "threshold", "equalityToHigher"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tier: { type: "string", maxLength: 8192 } },
  required: ["tier"],
} as const;
/** Resolve one supplied vendor-tier threshold without selecting a price schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, threshold, equalityToHigher } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0 && threshold >= 0);
    return {
      tier:
        quantity > threshold || (quantity === threshold && equalityToHigher)
          ? "higher"
          : "lower",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 100, threshold: 100, equalityToHigher: true },
  output: { tier: "higher" },
} satisfies ToolExample<Input, Output>;
export const vendorTierQuantityBoundaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/vendor-tier-quantity-boundary-token",
    title: "Vendor Tier Quantity Boundary Token Tool",
    description:
      "Resolve one supplied vendor-tier threshold without selecting a price schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        threshold: { type: "number", minimum: 0 },
        equalityToHigher: { type: "boolean" },
      },
      required: ["quantity", "threshold", "equalityToHigher"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tier: { type: "string", maxLength: 8192 } },
      required: ["tier"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityToHigher",
          label: "Equality To Higher",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "tier", label: "Tier", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = vendorTierQuantityBoundaryTokenTool.execute;
export default vendorTierQuantityBoundaryTokenTool;

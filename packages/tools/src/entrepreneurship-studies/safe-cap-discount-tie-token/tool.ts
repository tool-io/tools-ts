import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capPrice: number;
  readonly discountedPrice: number;
  readonly equalityPolicy: string;
};
export type Output = {
  readonly chosenPrice: number;
  readonly selectedBasis: string;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capPrice: { type: "number", exclusiveMinimum: 0 },
    discountedPrice: { type: "number", exclusiveMinimum: 0 },
    equalityPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["cap", "discount"],
    },
  },
  required: ["capPrice", "discountedPrice", "equalityPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chosenPrice: { type: "number" },
    selectedBasis: { type: "string", maxLength: 8192 },
    tied: { type: "boolean" },
  },
  required: ["chosenPrice", "selectedBasis", "tied"],
} as const;
/** Select between caller-computed SAFE cap/discount prices with an explicit tie convention; no valuation cap is calculated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capPrice, discountedPrice, equalityPolicy } = request;
  const compute = (): Output => {
    H.domain(
      capPrice > 0 &&
        discountedPrice > 0 &&
        ["cap", "discount"].includes(equalityPolicy),
    );
    const tied = capPrice === discountedPrice,
      selectedBasis = tied
        ? equalityPolicy
        : capPrice < discountedPrice
          ? "cap"
          : "discount";
    return {
      chosenPrice: Math.min(capPrice, discountedPrice),
      selectedBasis,
      tied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capPrice: 2, discountedPrice: 2, equalityPolicy: "cap" },
  output: { chosenPrice: 2, selectedBasis: "cap", tied: true },
} satisfies ToolExample<Input, Output>;
export const safeCapDiscountTieTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/safe-cap-discount-tie-token",
    title: "Safe Cap Discount Tie Token Tool",
    description:
      "Select between caller-computed SAFE cap/discount prices with an explicit tie convention; no valuation cap is calculated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capPrice: { type: "number", exclusiveMinimum: 0 },
        discountedPrice: { type: "number", exclusiveMinimum: 0 },
        equalityPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["cap", "discount"],
        },
      },
      required: ["capPrice", "discountedPrice", "equalityPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chosenPrice: { type: "number" },
        selectedBasis: { type: "string", maxLength: 8192 },
        tied: { type: "boolean" },
      },
      required: ["chosenPrice", "selectedBasis", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "capPrice",
          label: "Cap Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discountedPrice",
          label: "Discounted Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityPolicy",
          label: "Equality Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "chosenPrice",
          label: "Chosen Price",
          valueType: { type: "number" },
        },
        {
          id: "selectedBasis",
          label: "Selected Basis",
          valueType: { type: "string" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = safeCapDiscountTieTokenTool.execute;
export default safeCapDiscountTieTokenTool;

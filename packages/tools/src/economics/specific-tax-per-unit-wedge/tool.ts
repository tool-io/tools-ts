import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preTaxUnitPrice: number;
  readonly taxPerUnit: number;
  readonly quantity: number;
};
export type Output = {
  readonly postTaxUnitPrice: number;
  readonly totalTax: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preTaxUnitPrice: { type: "number", minimum: 0 },
    taxPerUnit: { type: "number", minimum: 0 },
    quantity: { type: "number", minimum: 0 },
  },
  required: ["preTaxUnitPrice", "taxPerUnit", "quantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postTaxUnitPrice: { type: "number" },
    totalTax: { type: "number" },
  },
  required: ["postTaxUnitPrice", "totalTax"],
} as const;
/** Apply a supplied specific tax per physical unit, without modelling demand, supply or incidence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preTaxUnitPrice, taxPerUnit, quantity } = request;
  const compute = (): Output => {
    H.domain(
      preTaxUnitPrice >= 0 && taxPerUnit >= 0 && quantity >= 0,
      "preTaxUnitPrice",
    );
    return {
      postTaxUnitPrice: preTaxUnitPrice + taxPerUnit,
      totalTax: taxPerUnit * quantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preTaxUnitPrice: 5, taxPerUnit: 0.5, quantity: 20 },
  output: { postTaxUnitPrice: 5.5, totalTax: 10 },
} satisfies ToolExample<Input, Output>;
export const specificTaxPerUnitWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/specific-tax-per-unit-wedge",
    title: "Specific Tax Per Unit Wedge Tool",
    description:
      "Apply a supplied specific tax per physical unit, without modelling demand, supply or incidence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preTaxUnitPrice: { type: "number", minimum: 0 },
        taxPerUnit: { type: "number", minimum: 0 },
        quantity: { type: "number", minimum: 0 },
      },
      required: ["preTaxUnitPrice", "taxPerUnit", "quantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postTaxUnitPrice: { type: "number" },
        totalTax: { type: "number" },
      },
      required: ["postTaxUnitPrice", "totalTax"],
    },
    ports: {
      inputs: [
        {
          id: "preTaxUnitPrice",
          label: "Pre Tax Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxPerUnit",
          label: "Tax Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "postTaxUnitPrice",
          label: "Post Tax Unit Price",
          valueType: { type: "number" },
        },
        { id: "totalTax", label: "Total Tax", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = specificTaxPerUnitWedgeTool.execute;
export default specificTaxPerUnitWedgeTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly units: number;
  readonly supplementalFee: number;
  readonly reimbursed: number;
};
export type Output = {
  readonly grossUnitPrice: number;
  readonly netUnitPrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", minimum: 0 },
    units: { type: "integer", minimum: 1 },
    supplementalFee: { type: "number", minimum: 0 },
    reimbursed: { type: "number", minimum: 0 },
  },
  required: ["price", "units", "supplementalFee", "reimbursed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossUnitPrice: { type: "number" },
    netUnitPrice: { type: "number" },
  },
  required: ["grossUnitPrice", "netUnitPrice"],
} as const;
/** Calculate pharmacy package unit price supplement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, units, supplementalFee, reimbursed } = request;
  const compute = (): Output => {
    H.integer(units, 1);
    H.domain(price >= 0 && supplementalFee >= 0 && reimbursed >= 0);
    return {
      grossUnitPrice: (price + supplementalFee) / units,
      netUnitPrice: (price + supplementalFee - reimbursed) / units,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 20, units: 10, supplementalFee: 2, reimbursed: 5 },
  output: { grossUnitPrice: 2.2, netUnitPrice: 1.7 },
} satisfies ToolExample<Input, Output>;
export const pharmacyPackageUnitPriceSupplementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/pharmacy-package-unit-price-supplement",
    title: "Pharmacy Package Unit Price Supplement Tool",
    description:
      "Calculate pharmacy package unit price supplement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number", minimum: 0 },
        units: { type: "integer", minimum: 1 },
        supplementalFee: { type: "number", minimum: 0 },
        reimbursed: { type: "number", minimum: 0 },
      },
      required: ["price", "units", "supplementalFee", "reimbursed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossUnitPrice: { type: "number" },
        netUnitPrice: { type: "number" },
      },
      required: ["grossUnitPrice", "netUnitPrice"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "supplementalFee",
          label: "Supplemental Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reimbursed",
          label: "Reimbursed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossUnitPrice",
          label: "Gross Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "netUnitPrice",
          label: "Net Unit Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyPackageUnitPriceSupplementTool.execute;
export default pharmacyPackageUnitPriceSupplementTool;

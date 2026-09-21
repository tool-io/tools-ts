import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly purchasePrice: number;
  readonly annualRate: number;
  readonly storageDays: number;
  readonly yearDays: number;
  readonly storageCostPerUnit: number;
};
export type Output = {
  readonly financingCost: number;
  readonly totalCarry: number;
  readonly breakEvenSalePrice: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    purchasePrice: { type: "number", minimum: 0 },
    annualRate: { type: "number", minimum: 0 },
    storageDays: { type: "number", minimum: 0 },
    yearDays: { type: "number", exclusiveMinimum: 0 },
    storageCostPerUnit: { type: "number", minimum: 0 },
  },
  required: [
    "quantity",
    "purchasePrice",
    "annualRate",
    "storageDays",
    "yearDays",
    "storageCostPerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    financingCost: { type: "number" },
    totalCarry: { type: "number" },
    breakEvenSalePrice: { type: "number" },
  },
  required: ["financingCost", "totalCarry", "breakEvenSalePrice"],
} as const;
/** Calculate crop storage interest carry term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    quantity,
    purchasePrice,
    annualRate,
    storageDays,
    yearDays,
    storageCostPerUnit,
  } = request;
  const compute = (): Output => {
    H.domain(
      quantity >= 0 &&
        purchasePrice >= 0 &&
        annualRate >= 0 &&
        storageDays >= 0 &&
        storageCostPerUnit >= 0,
    );
    H.positive(yearDays);
    return {
      financingCost:
        (quantity * purchasePrice * annualRate * storageDays) / yearDays,
      totalCarry:
        quantity *
        ((purchasePrice * annualRate * storageDays) / yearDays +
          storageCostPerUnit),
      breakEvenSalePrice:
        purchasePrice * (1 + (annualRate * storageDays) / yearDays) +
        storageCostPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quantity: 100,
    purchasePrice: 20,
    annualRate: 0.1,
    storageDays: 180,
    yearDays: 360,
    storageCostPerUnit: 2,
  },
  output: { financingCost: 100, totalCarry: 300, breakEvenSalePrice: 23 },
} satisfies ToolExample<Input, Output>;
export const cropStorageInterestCarryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-storage-interest-carry-term",
    title: "Crop Storage Interest Carry Term Tool",
    description:
      "Calculate crop storage interest carry term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        purchasePrice: { type: "number", minimum: 0 },
        annualRate: { type: "number", minimum: 0 },
        storageDays: { type: "number", minimum: 0 },
        yearDays: { type: "number", exclusiveMinimum: 0 },
        storageCostPerUnit: { type: "number", minimum: 0 },
      },
      required: [
        "quantity",
        "purchasePrice",
        "annualRate",
        "storageDays",
        "yearDays",
        "storageCostPerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        financingCost: { type: "number" },
        totalCarry: { type: "number" },
        breakEvenSalePrice: { type: "number" },
      },
      required: ["financingCost", "totalCarry", "breakEvenSalePrice"],
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
          id: "purchasePrice",
          label: "Purchase Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageDays",
          label: "Storage Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "storageCostPerUnit",
          label: "Storage Cost Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "financingCost",
          label: "Financing Cost",
          valueType: { type: "number" },
        },
        {
          id: "totalCarry",
          label: "Total Carry",
          valueType: { type: "number" },
        },
        {
          id: "breakEvenSalePrice",
          label: "Break Even Sale Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropStorageInterestCarryTermTool.execute;
export default cropStorageInterestCarryTermTool;

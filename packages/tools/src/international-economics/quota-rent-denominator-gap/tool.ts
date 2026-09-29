import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalRent: number;
  readonly allocatedQuantity: number;
  readonly importedQuantity: number;
  readonly useAllocated: boolean;
};
export type Output = {
  readonly rentPerUnit: number;
  readonly denominatorGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalRent: { type: "number" },
    allocatedQuantity: { type: "number", exclusiveMinimum: 0 },
    importedQuantity: { type: "number", exclusiveMinimum: 0 },
    useAllocated: { type: "boolean" },
  },
  required: [
    "totalRent",
    "allocatedQuantity",
    "importedQuantity",
    "useAllocated",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rentPerUnit: { type: "number" },
    denominatorGap: { type: "number" },
  },
  required: ["rentPerUnit", "denominatorGap"],
} as const;
/** Compare rent per allocated versus imported unit with caller-supplied quantities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalRent, allocatedQuantity, importedQuantity, useAllocated } =
    request;
  const compute = (): Output => {
    H.positive(allocatedQuantity);
    H.positive(importedQuantity);
    return {
      rentPerUnit:
        totalRent / (useAllocated ? allocatedQuantity : importedQuantity),
      denominatorGap: allocatedQuantity - importedQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalRent: 200,
    allocatedQuantity: 100,
    importedQuantity: 80,
    useAllocated: true,
  },
  output: { rentPerUnit: 2, denominatorGap: 20 },
} satisfies ToolExample<Input, Output>;
export const quotaRentDenominatorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/quota-rent-denominator-gap",
    title: "Quota Rent Denominator Gap Tool",
    description:
      "Compare rent per allocated versus imported unit with caller-supplied quantities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalRent: { type: "number" },
        allocatedQuantity: { type: "number", exclusiveMinimum: 0 },
        importedQuantity: { type: "number", exclusiveMinimum: 0 },
        useAllocated: { type: "boolean" },
      },
      required: [
        "totalRent",
        "allocatedQuantity",
        "importedQuantity",
        "useAllocated",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rentPerUnit: { type: "number" },
        denominatorGap: { type: "number" },
      },
      required: ["rentPerUnit", "denominatorGap"],
    },
    ports: {
      inputs: [
        {
          id: "totalRent",
          label: "Total Rent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedQuantity",
          label: "Allocated Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "importedQuantity",
          label: "Imported Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useAllocated",
          label: "Use Allocated",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rentPerUnit",
          label: "Rent Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "denominatorGap",
          label: "Denominator Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotaRentDenominatorGapTool.execute;
export default quotaRentDenominatorGapTool;

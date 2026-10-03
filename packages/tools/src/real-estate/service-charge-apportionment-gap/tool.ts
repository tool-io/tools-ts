import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedCharge: number;
  readonly totalCost: number;
  readonly allocationWeight: number;
  readonly totalWeight: number;
};
export type Output = { readonly expectedCharge: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedCharge: { type: "number" },
    totalCost: { type: "number", minimum: 0 },
    allocationWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedCharge", "totalCost", "allocationWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedCharge: { type: "number" }, gap: { type: "number" } },
  required: ["expectedCharge", "gap"],
} as const;
/** Calculate service charge apportionment gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedCharge, totalCost, allocationWeight, totalWeight } = request;
  const compute = (): Output => {
    H.positive(totalWeight);
    H.domain(
      totalCost >= 0 &&
        allocationWeight >= 0 &&
        allocationWeight <= totalWeight,
    );
    return {
      expectedCharge: (totalCost * allocationWeight) / totalWeight,
      gap: reportedCharge - (totalCost * allocationWeight) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedCharge: 30,
    totalCost: 100,
    allocationWeight: 2,
    totalWeight: 10,
  },
  output: { expectedCharge: 20, gap: 10 },
} satisfies ToolExample<Input, Output>;
export const serviceChargeApportionmentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/service-charge-apportionment-gap",
    title: "Service Charge Apportionment Gap Tool",
    description:
      "Calculate service charge apportionment gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedCharge: { type: "number" },
        totalCost: { type: "number", minimum: 0 },
        allocationWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "reportedCharge",
        "totalCost",
        "allocationWeight",
        "totalWeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedCharge: { type: "number" },
        gap: { type: "number" },
      },
      required: ["expectedCharge", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedCharge",
          label: "Reported Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocationWeight",
          label: "Allocation Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedCharge",
          label: "Expected Charge",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceChargeApportionmentGapTool.execute;
export default serviceChargeApportionmentGapTool;

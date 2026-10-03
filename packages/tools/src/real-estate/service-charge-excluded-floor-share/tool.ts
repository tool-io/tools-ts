import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCost: number;
  readonly tenantArea: number;
  readonly totalArea: number;
  readonly excludedArea: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly tenantFraction: number;
  readonly charge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCost: { type: "number", minimum: 0 },
    tenantArea: { type: "number", minimum: 0 },
    totalArea: { type: "number" },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["totalCost", "tenantArea", "totalArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    tenantFraction: { type: "number" },
    charge: { type: "number" },
  },
  required: ["eligibleArea", "tenantFraction", "charge"],
} as const;
/** Calculate service charge excluded floor share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCost, tenantArea, totalArea, excludedArea } = request;
  const compute = (): Output => {
    H.domain(
      totalCost >= 0 &&
        excludedArea >= 0 &&
        totalArea > excludedArea &&
        tenantArea >= 0 &&
        tenantArea <= totalArea - excludedArea,
    );
    return {
      eligibleArea: totalArea - excludedArea,
      tenantFraction: tenantArea / (totalArea - excludedArea),
      charge: (totalCost * tenantArea) / (totalArea - excludedArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalCost: 10000,
    tenantArea: 100,
    totalArea: 1000,
    excludedArea: 200,
  },
  output: { eligibleArea: 800, tenantFraction: 0.125, charge: 1250 },
} satisfies ToolExample<Input, Output>;
export const serviceChargeExcludedFloorShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/service-charge-excluded-floor-share",
    title: "Service Charge Excluded Floor Share Tool",
    description:
      "Calculate service charge excluded floor share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCost: { type: "number", minimum: 0 },
        tenantArea: { type: "number", minimum: 0 },
        totalArea: { type: "number" },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["totalCost", "tenantArea", "totalArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        tenantFraction: { type: "number" },
        charge: { type: "number" },
      },
      required: ["eligibleArea", "tenantFraction", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "totalCost",
          label: "Total Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tenantArea",
          label: "Tenant Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalArea",
          label: "Total Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          valueType: { type: "number" },
        },
        {
          id: "tenantFraction",
          label: "Tenant Fraction",
          valueType: { type: "number" },
        },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = serviceChargeExcludedFloorShareTool.execute;
export default serviceChargeExcludedFloorShareTool;

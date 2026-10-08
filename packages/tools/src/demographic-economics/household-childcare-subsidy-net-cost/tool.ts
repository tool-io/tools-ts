import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossChildcareCost: number;
  readonly suppliedSubsidy: number;
};
export type Output = { readonly netCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossChildcareCost: { type: "number", minimum: 0 },
    suppliedSubsidy: { type: "number", minimum: 0 },
  },
  required: ["grossChildcareCost", "suppliedSubsidy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netCost: { type: "number" } },
  required: ["netCost"],
} as const;
/** Subtract an explicit childcare subsidy from household cost without determining eligibility or clipping discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossChildcareCost, suppliedSubsidy } = request;
  const compute = (): Output => {
    H.domain(grossChildcareCost >= 0, "grossChildcareCost");
    H.domain(suppliedSubsidy >= 0, "suppliedSubsidy");
    return { netCost: grossChildcareCost - suppliedSubsidy };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossChildcareCost: 500, suppliedSubsidy: 200 },
  output: { netCost: 300 },
} satisfies ToolExample<Input, Output>;
export const householdChildcareSubsidyNetCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/household-childcare-subsidy-net-cost",
    title: "Household Childcare Subsidy Net Cost Tool",
    description:
      "Subtract an explicit childcare subsidy from household cost without determining eligibility or clipping discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossChildcareCost: { type: "number", minimum: 0 },
        suppliedSubsidy: { type: "number", minimum: 0 },
      },
      required: ["grossChildcareCost", "suppliedSubsidy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netCost: { type: "number" } },
      required: ["netCost"],
    },
    ports: {
      inputs: [
        {
          id: "grossChildcareCost",
          label: "Gross Childcare Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedSubsidy",
          label: "Supplied Subsidy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdChildcareSubsidyNetCostTool.execute;
export default householdChildcareSubsidyNetCostTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emissionsPerFuelUnit: number;
  readonly suppliedTaxPerEmissionUnit: number;
};
export type Output = { readonly taxCostPerFuelUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emissionsPerFuelUnit: { type: "number", minimum: 0 },
    suppliedTaxPerEmissionUnit: { type: "number" },
  },
  required: ["emissionsPerFuelUnit", "suppliedTaxPerEmissionUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxCostPerFuelUnit: { type: "number" } },
  required: ["taxCostPerFuelUnit"],
} as const;
/** Multiply supplied fuel emission intensity by an explicit signed carbon price in compatible emission units without determining taxable scope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emissionsPerFuelUnit, suppliedTaxPerEmissionUnit } = request;
  const compute = (): Output => {
    H.domain(emissionsPerFuelUnit >= 0, "emissionsPerFuelUnit");
    return {
      taxCostPerFuelUnit: emissionsPerFuelUnit * suppliedTaxPerEmissionUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emissionsPerFuelUnit: 2, suppliedTaxPerEmissionUnit: 30 },
  output: { taxCostPerFuelUnit: 60 },
} satisfies ToolExample<Input, Output>;
export const fuelCarbonTaxSingleUnitCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/fuel-carbon-tax-single-unit-cost",
    title: "Fuel Carbon Tax Single Unit Cost Tool",
    description:
      "Multiply supplied fuel emission intensity by an explicit signed carbon price in compatible emission units without determining taxable scope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emissionsPerFuelUnit: { type: "number", minimum: 0 },
        suppliedTaxPerEmissionUnit: { type: "number" },
      },
      required: ["emissionsPerFuelUnit", "suppliedTaxPerEmissionUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { taxCostPerFuelUnit: { type: "number" } },
      required: ["taxCostPerFuelUnit"],
    },
    ports: {
      inputs: [
        {
          id: "emissionsPerFuelUnit",
          label: "Emissions Per Fuel Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxPerEmissionUnit",
          label: "Supplied Tax Per Emission Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "taxCostPerFuelUnit",
          label: "Tax Cost Per Fuel Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fuelCarbonTaxSingleUnitCostTool.execute;
export default fuelCarbonTaxSingleUnitCostTool;

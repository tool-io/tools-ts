import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massSpecificCapacity: number;
  readonly suppliedBulkDensity: number;
};
export type Output = { readonly volumetricCapacity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massSpecificCapacity: { type: "number", minimum: 0 },
    suppliedBulkDensity: { type: "number", minimum: 0 },
  },
  required: ["massSpecificCapacity", "suppliedBulkDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumetricCapacity: { type: "number" } },
  required: ["volumetricCapacity"],
} as const;
/** Convert compatible supplied specific and bulk-density bases without inferring soil composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massSpecificCapacity, suppliedBulkDensity } = request;
  const compute = (): Output => {
    H.domain(massSpecificCapacity >= 0 && suppliedBulkDensity >= 0);
    return { volumetricCapacity: massSpecificCapacity * suppliedBulkDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massSpecificCapacity: 2, suppliedBulkDensity: 1500 },
  output: { volumetricCapacity: 3000 },
} satisfies ToolExample<Input, Output>;
export const soilHeatCapacityBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-heat-capacity-basis-factor",
    title: "Soil Heat Capacity Basis Factor Tool",
    description:
      "Convert compatible supplied specific and bulk-density bases without inferring soil composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massSpecificCapacity: { type: "number", minimum: 0 },
        suppliedBulkDensity: { type: "number", minimum: 0 },
      },
      required: ["massSpecificCapacity", "suppliedBulkDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumetricCapacity: { type: "number" } },
      required: ["volumetricCapacity"],
    },
    ports: {
      inputs: [
        {
          id: "massSpecificCapacity",
          label: "Mass Specific Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBulkDensity",
          label: "Supplied Bulk Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumetricCapacity",
          label: "Volumetric Capacity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilHeatCapacityBasisFactorTool.execute;
export default soilHeatCapacityBasisFactorTool;

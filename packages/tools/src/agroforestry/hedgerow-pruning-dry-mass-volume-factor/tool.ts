import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly looseVolume: number;
  readonly wetBulkDensity: number;
  readonly moisture: number;
};
export type Output = { readonly dryMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    looseVolume: { type: "number", minimum: 0 },
    wetBulkDensity: { type: "number", minimum: 0 },
    moisture: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["looseVolume", "wetBulkDensity", "moisture"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" } },
  required: ["dryMass"],
} as const;
/** Calculate hedgerow pruning dry mass volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { looseVolume, wetBulkDensity, moisture } = request;
  const compute = (): Output => {
    H.domain(looseVolume >= 0 && wetBulkDensity >= 0);
    H.probability(moisture);
    return { dryMass: looseVolume * wetBulkDensity * (1 - moisture) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { looseVolume: 2, wetBulkDensity: 100, moisture: 0.4 },
  output: { dryMass: 120 },
} satisfies ToolExample<Input, Output>;
export const hedgerowPruningDryMassVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/hedgerow-pruning-dry-mass-volume-factor",
    title: "Hedgerow Pruning Dry Mass Volume Factor Tool",
    description:
      "Calculate hedgerow pruning dry mass volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        looseVolume: { type: "number", minimum: 0 },
        wetBulkDensity: { type: "number", minimum: 0 },
        moisture: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["looseVolume", "wetBulkDensity", "moisture"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMass: { type: "number" } },
      required: ["dryMass"],
    },
    ports: {
      inputs: [
        {
          id: "looseVolume",
          label: "Loose Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetBulkDensity",
          label: "Wet Bulk Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moisture",
          label: "Moisture",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hedgerowPruningDryMassVolumeFactorTool.execute;
export default hedgerowPruningDryMassVolumeFactorTool;

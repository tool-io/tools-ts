import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly volumeCubicMeters: number;
  readonly suppliedDensityKgPerCubicMeter: number;
};
export type Output = { readonly massKg: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeCubicMeters: { type: "number", minimum: 0 },
    suppliedDensityKgPerCubicMeter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["volumeCubicMeters", "suppliedDensityKgPerCubicMeter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massKg: { type: "number" } },
  required: ["massKg"],
} as const;
/** Convert a recorded cryogenic-liquid volume to mass using an explicitly supplied state-specific density without selecting a fluid property. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { volumeCubicMeters, suppliedDensityKgPerCubicMeter } = request;
  const compute = (): Output => {
    H.domain(volumeCubicMeters >= 0, "volumeCubicMeters");
    (H.domain(
      suppliedDensityKgPerCubicMeter > 0,
      "suppliedDensityKgPerCubicMeter",
    ),
      suppliedDensityKgPerCubicMeter);
    return { massKg: volumeCubicMeters * suppliedDensityKgPerCubicMeter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { volumeCubicMeters: 0.1, suppliedDensityKgPerCubicMeter: 800 },
  output: { massKg: 80 },
} satisfies ToolExample<Input, Output>;
export const cryogenicInventoryMassVolumePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cryogenics", "physics"],
      keywords: ["cryogenics", "physics"],
    },
    id: "cryogenics/cryogenic-inventory-mass-volume-pair",
    title: "Cryogenic Inventory Mass Volume Pair",
    description:
      "Convert a recorded cryogenic-liquid volume to mass using an explicitly supplied state-specific density without selecting a fluid property.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeCubicMeters: { type: "number", minimum: 0 },
        suppliedDensityKgPerCubicMeter: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["volumeCubicMeters", "suppliedDensityKgPerCubicMeter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massKg: { type: "number" } },
      required: ["massKg"],
    },
    ports: {
      inputs: [
        {
          id: "volumeCubicMeters",
          label: "Volume Cubic Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDensityKgPerCubicMeter",
          label: "Supplied Density Kg Per Cubic Meter",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "massKg", label: "Mass Kg", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cryogenicInventoryMassVolumePairTool.execute;
export default cryogenicInventoryMassVolumePairTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentrationMilligramsPerLiter: number;
  readonly volumeCubicMeters: number;
};
export type Output = { readonly loadKilograms: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentrationMilligramsPerLiter: { type: "number", minimum: 0 },
    volumeCubicMeters: { type: "number", minimum: 0 },
  },
  required: ["concentrationMilligramsPerLiter", "volumeCubicMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loadKilograms: { type: "number" } },
  required: ["loadKilograms"],
} as const;
/** Convert a stated concentration and compatible wastewater volume into a pollutant mass in kilograms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentrationMilligramsPerLiter, volumeCubicMeters } = request;
  const compute = (): Output => {
    H.domain(
      concentrationMilligramsPerLiter >= 0 && volumeCubicMeters >= 0,
      "concentrationMilligramsPerLiter",
    );
    return {
      loadKilograms:
        (concentrationMilligramsPerLiter * volumeCubicMeters) / 1000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentrationMilligramsPerLiter: 250, volumeCubicMeters: 40 },
  output: { loadKilograms: 10 },
} satisfies ToolExample<Input, Output>;
export const wastewaterLoadConcentrationVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-engineering",
        "environmental engineering",
        "engineering",
      ],
      keywords: ["environmental engineering", "engineering"],
    },
    id: "environmental-engineering/wastewater-load-concentration-volume",
    title: "Wastewater Load Concentration Volume",
    description:
      "Convert a stated concentration and compatible wastewater volume into a pollutant mass in kilograms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentrationMilligramsPerLiter: { type: "number", minimum: 0 },
        volumeCubicMeters: { type: "number", minimum: 0 },
      },
      required: ["concentrationMilligramsPerLiter", "volumeCubicMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loadKilograms: { type: "number" } },
      required: ["loadKilograms"],
    },
    ports: {
      inputs: [
        {
          id: "concentrationMilligramsPerLiter",
          label: "Concentration Milligrams Per Liter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "volumeCubicMeters",
          label: "Volume Cubic Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "loadKilograms",
          label: "Load Kilograms",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wastewaterLoadConcentrationVolumeTool.execute;
export default wastewaterLoadConcentrationVolumeTool;

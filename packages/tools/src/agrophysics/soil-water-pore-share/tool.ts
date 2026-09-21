import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly waterVolume: number;
  readonly poreVolume: number;
};
export type Output = { readonly saturationFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterVolume: { type: "number", minimum: 0 },
    poreVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterVolume", "poreVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { saturationFraction: { type: "number" } },
  required: ["saturationFraction"],
} as const;
/** Calculate soil water pore share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterVolume, poreVolume } = request;
  const compute = (): Output => {
    H.positive(poreVolume);
    H.domain(waterVolume >= 0 && waterVolume <= poreVolume);
    return { saturationFraction: waterVolume / poreVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterVolume: 3, poreVolume: 10 },
  output: { saturationFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const soilWaterPoreShareTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "agrophysics/soil-water-pore-share",
    title: "Soil Water Pore Share Tool",
    description:
      "Calculate soil water pore share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterVolume: { type: "number", minimum: 0 },
        poreVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["waterVolume", "poreVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { saturationFraction: { type: "number" } },
      required: ["saturationFraction"],
    },
    ports: {
      inputs: [
        {
          id: "waterVolume",
          label: "Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "poreVolume",
          label: "Pore Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "saturationFraction",
          label: "Saturation Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilWaterPoreShareTool.execute;
export default soilWaterPoreShareTool;

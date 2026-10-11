import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly occupiedFraction: number };
export type Output = { readonly freeFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { occupiedFraction: { type: "number", minimum: 0, maximum: 1 } },
  required: ["occupiedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { freeFraction: { type: "number" } },
  required: ["freeFraction"],
} as const;
/** Return the complement of an explicitly supplied occupied-site fraction without estimating occupancy from concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occupiedFraction } = request;
  const compute = (): Output => {
    (H.domain(
      occupiedFraction >= 0 && occupiedFraction <= 1,
      "occupiedFraction",
    ),
      occupiedFraction);
    return { freeFraction: 1 - occupiedFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occupiedFraction: 0.75 },
  output: { freeFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const pdOccupancyToFreeFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-occupancy-to-free-fraction",
    title: "PD Occupancy To Free Fraction",
    description:
      "Return the complement of an explicitly supplied occupied-site fraction without estimating occupancy from concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupiedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["occupiedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { freeFraction: { type: "number" } },
      required: ["freeFraction"],
    },
    ports: {
      inputs: [
        {
          id: "occupiedFraction",
          label: "Occupied Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "freeFraction",
          label: "Free Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdOccupancyToFreeFractionTool.execute;
export default pdOccupancyToFreeFractionTool;

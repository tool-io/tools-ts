import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ratePerSquareMeter: number;
  readonly areaSquareMeters: number;
};
export type Output = { readonly totalRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratePerSquareMeter: { type: "number" },
    areaSquareMeters: { type: "number" },
  },
  required: ["ratePerSquareMeter", "areaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalRate: { type: "number" } },
  required: ["totalRate"],
} as const;
/** Integrate a spatially uniform signed rate per square meter over a nonnegative supplied area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ratePerSquareMeter, areaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(areaSquareMeters >= 0, "areaSquareMeters");
    return { totalRate: ratePerSquareMeter * areaSquareMeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ratePerSquareMeter: 2.5, areaSquareMeters: 12 },
  output: { totalRate: 30 },
} satisfies ToolExample<Input, Output>;
export const ratePerAreaToTotalFluxTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/rate-per-area-to-total-flux",
    title: "Rate Per Area To Total Flux Tool",
    description:
      "Integrate a spatially uniform signed rate per square meter over a nonnegative supplied area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratePerSquareMeter: { type: "number" },
        areaSquareMeters: { type: "number" },
      },
      required: ["ratePerSquareMeter", "areaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalRate: { type: "number" } },
      required: ["totalRate"],
    },
    ports: {
      inputs: [
        {
          id: "ratePerSquareMeter",
          label: "Rate Per Square Meter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaSquareMeters",
          label: "Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalRate", label: "Total Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ratePerAreaToTotalFluxTool.execute;
export default ratePerAreaToTotalFluxTool;

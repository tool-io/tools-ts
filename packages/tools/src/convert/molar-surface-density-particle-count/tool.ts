import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molesPerSquareMeter: number;
  readonly areaSquareMeters: number;
};
export type Output = { readonly particleCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molesPerSquareMeter: { type: "number", minimum: 0 },
    areaSquareMeters: { type: "number", minimum: 0 },
  },
  required: ["molesPerSquareMeter", "areaSquareMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { particleCount: { type: "number" } },
  required: ["particleCount"],
} as const;
/** Convert explicit uniform molar surface density and area to expected particle count using the exact SI Avogadro constant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { molesPerSquareMeter, areaSquareMeters } = request;
  const compute = (): Output => {
    H.domain(
      molesPerSquareMeter >= 0 && areaSquareMeters >= 0,
      "molesPerSquareMeter",
    );
    return {
      particleCount: molesPerSquareMeter * areaSquareMeters * 6.02214076e23,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { molesPerSquareMeter: 0.000001, areaSquareMeters: 2 },
  output: { particleCount: 1204428152000000000 },
} satisfies ToolExample<Input, Output>;
export const molarSurfaceDensityParticleCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["convert", "unit conversion", "computer science"],
      keywords: ["unit conversion", "computer science"],
    },
    id: "convert/molar-surface-density-particle-count",
    title: "Molar Surface Density Particle Count",
    description:
      "Convert explicit uniform molar surface density and area to expected particle count using the exact SI Avogadro constant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molesPerSquareMeter: { type: "number", minimum: 0 },
        areaSquareMeters: { type: "number", minimum: 0 },
      },
      required: ["molesPerSquareMeter", "areaSquareMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { particleCount: { type: "number" } },
      required: ["particleCount"],
    },
    ports: {
      inputs: [
        {
          id: "molesPerSquareMeter",
          label: "Moles Per Square Meter",
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
        {
          id: "particleCount",
          label: "Particle Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molarSurfaceDensityParticleCountTool.execute;
export default molarSurfaceDensityParticleCountTool;

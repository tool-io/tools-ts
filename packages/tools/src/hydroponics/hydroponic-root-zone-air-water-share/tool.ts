import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bedVolume: number;
  readonly poreFraction: number;
  readonly rootsVolume: number;
  readonly waterVolume: number;
};
export type Output = {
  readonly availablePores: number;
  readonly airResidual: number;
  readonly waterShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bedVolume: { type: "number", minimum: 0 },
    poreFraction: { type: "number", minimum: 0, maximum: 1 },
    rootsVolume: { type: "number", minimum: 0 },
    waterVolume: { type: "number", minimum: 0 },
  },
  required: ["bedVolume", "poreFraction", "rootsVolume", "waterVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availablePores: { type: "number" },
    airResidual: { type: "number" },
    waterShare: { type: "number" },
  },
  required: ["availablePores", "airResidual", "waterShare"],
} as const;
/** Calculate hydroponic root zone air water share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bedVolume, poreFraction, rootsVolume, waterVolume } = request;
  const compute = (): Output => {
    H.probability(poreFraction);
    H.domain(
      bedVolume >= 0 &&
        rootsVolume >= 0 &&
        bedVolume * poreFraction > rootsVolume &&
        waterVolume >= 0,
    );
    return {
      availablePores: bedVolume * poreFraction - rootsVolume,
      airResidual: bedVolume * poreFraction - rootsVolume - waterVolume,
      waterShare: waterVolume / (bedVolume * poreFraction - rootsVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bedVolume: 100,
    poreFraction: 0.6,
    rootsVolume: 10,
    waterVolume: 20,
  },
  output: { availablePores: 50, airResidual: 30, waterShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const hydroponicRootZoneAirWaterShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/hydroponic-root-zone-air-water-share",
    title: "Hydroponic Root Zone Air Water Share Tool",
    description:
      "Calculate hydroponic root zone air water share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bedVolume: { type: "number", minimum: 0 },
        poreFraction: { type: "number", minimum: 0, maximum: 1 },
        rootsVolume: { type: "number", minimum: 0 },
        waterVolume: { type: "number", minimum: 0 },
      },
      required: ["bedVolume", "poreFraction", "rootsVolume", "waterVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availablePores: { type: "number" },
        airResidual: { type: "number" },
        waterShare: { type: "number" },
      },
      required: ["availablePores", "airResidual", "waterShare"],
    },
    ports: {
      inputs: [
        {
          id: "bedVolume",
          label: "Bed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "poreFraction",
          label: "Pore Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "rootsVolume",
          label: "Roots Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterVolume",
          label: "Water Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availablePores",
          label: "Available Pores",
          valueType: { type: "number" },
        },
        {
          id: "airResidual",
          label: "Air Residual",
          valueType: { type: "number" },
        },
        {
          id: "waterShare",
          label: "Water Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydroponicRootZoneAirWaterShareTool.execute;
export default hydroponicRootZoneAirWaterShareTool;

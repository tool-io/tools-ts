import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly depth: number;
  readonly targetWaterFraction: number;
  readonly measuredWaterFraction: number;
};
export type Output = {
  readonly signedDeficit: number;
  readonly positiveDeficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "number", minimum: 0 },
    targetWaterFraction: { type: "number", minimum: 0, maximum: 1 },
    measuredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["depth", "targetWaterFraction", "measuredWaterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDeficit: { type: "number" },
    positiveDeficit: { type: "number" },
  },
  required: ["signedDeficit", "positiveDeficit"],
} as const;
/** Calculate soil storage deficit one layer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, targetWaterFraction, measuredWaterFraction } = request;
  const compute = (): Output => {
    H.domain(depth >= 0);
    H.probability(targetWaterFraction);
    H.probability(measuredWaterFraction);
    return {
      signedDeficit: depth * (targetWaterFraction - measuredWaterFraction),
      positiveDeficit: Math.max(
        0,
        depth * (targetWaterFraction - measuredWaterFraction),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 1, targetWaterFraction: 0.4, measuredWaterFraction: 0.25 },
  output: {
    signedDeficit: 0.15000000000000002,
    positiveDeficit: 0.15000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const soilStorageDeficitOneLayerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/soil-storage-deficit-one-layer",
    title: "Soil Storage Deficit One Layer Tool",
    description:
      "Calculate soil storage deficit one layer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "number", minimum: 0 },
        targetWaterFraction: { type: "number", minimum: 0, maximum: 1 },
        measuredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["depth", "targetWaterFraction", "measuredWaterFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDeficit: { type: "number" },
        positiveDeficit: { type: "number" },
      },
      required: ["signedDeficit", "positiveDeficit"],
    },
    ports: {
      inputs: [
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetWaterFraction",
          label: "Target Water Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "measuredWaterFraction",
          label: "Measured Water Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "signedDeficit",
          label: "Signed Deficit",
          valueType: { type: "number" },
        },
        {
          id: "positiveDeficit",
          label: "Positive Deficit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilStorageDeficitOneLayerTool.execute;
export default soilStorageDeficitOneLayerTool;

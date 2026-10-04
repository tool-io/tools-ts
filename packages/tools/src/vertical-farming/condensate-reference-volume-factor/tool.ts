import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedVolume: number;
  readonly sourceDensity: number;
  readonly referenceDensity: number;
};
export type Output = {
  readonly referenceVolume: number;
  readonly mass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedVolume: { type: "number", minimum: 0 },
    sourceDensity: { type: "number", exclusiveMinimum: 0 },
    referenceDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["collectedVolume", "sourceDensity", "referenceDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceVolume: { type: "number" }, mass: { type: "number" } },
  required: ["referenceVolume", "mass"],
} as const;
/** Convert supplied condensate volume by mass conservation between explicit densities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedVolume, sourceDensity, referenceDensity } = request;
  const compute = (): Output => {
    H.domain(collectedVolume >= 0);
    H.positive(sourceDensity);
    H.positive(referenceDensity);
    return {
      referenceVolume: (collectedVolume * sourceDensity) / referenceDensity,
      mass: collectedVolume * sourceDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedVolume: 10, sourceDensity: 0.9, referenceDensity: 1 },
  output: { referenceVolume: 9, mass: 9 },
} satisfies ToolExample<Input, Output>;
export const condensateReferenceVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/condensate-reference-volume-factor",
    title: "Condensate Reference Volume Factor Tool",
    description:
      "Convert supplied condensate volume by mass conservation between explicit densities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedVolume: { type: "number", minimum: 0 },
        sourceDensity: { type: "number", exclusiveMinimum: 0 },
        referenceDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["collectedVolume", "sourceDensity", "referenceDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceVolume: { type: "number" },
        mass: { type: "number" },
      },
      required: ["referenceVolume", "mass"],
    },
    ports: {
      inputs: [
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceDensity",
          label: "Source Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDensity",
          label: "Reference Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceVolume",
          label: "Reference Volume",
          valueType: { type: "number" },
        },
        { id: "mass", label: "Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = condensateReferenceVolumeFactorTool.execute;
export default condensateReferenceVolumeFactorTool;

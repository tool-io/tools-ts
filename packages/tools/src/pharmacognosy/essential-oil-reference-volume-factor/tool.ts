import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly suppliedDensity: number;
  readonly sourceVolumeScale: number;
  readonly referenceVolume: number;
};
export type Output = {
  readonly volume: number;
  readonly referenceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    suppliedDensity: { type: "number", exclusiveMinimum: 0 },
    sourceVolumeScale: { type: "number", exclusiveMinimum: 0 },
    referenceVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "suppliedDensity", "sourceVolumeScale", "referenceVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volume: { type: "number" },
    referenceRatio: { type: "number" },
  },
  required: ["volume", "referenceRatio"],
} as const;
/** Convert supplied mass/density and explicit volume bases without recommending essential-oil use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, suppliedDensity, sourceVolumeScale, referenceVolume } = request;
  const compute = (): Output => {
    H.domain(mass >= 0);
    H.positive(suppliedDensity);
    H.positive(sourceVolumeScale);
    H.positive(referenceVolume);
    return {
      volume: (mass / suppliedDensity) * sourceVolumeScale,
      referenceRatio:
        ((mass / suppliedDensity) * sourceVolumeScale) / referenceVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mass: 8,
    suppliedDensity: 0.8,
    sourceVolumeScale: 1,
    referenceVolume: 20,
  },
  output: { volume: 10, referenceRatio: 0.5 },
} satisfies ToolExample<Input, Output>;
export const essentialOilReferenceVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/essential-oil-reference-volume-factor",
    title: "Essential Oil Reference Volume Factor Tool",
    description:
      "Convert supplied mass/density and explicit volume bases without recommending essential-oil use.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        suppliedDensity: { type: "number", exclusiveMinimum: 0 },
        sourceVolumeScale: { type: "number", exclusiveMinimum: 0 },
        referenceVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "mass",
        "suppliedDensity",
        "sourceVolumeScale",
        "referenceVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number" },
        referenceRatio: { type: "number" },
      },
      required: ["volume", "referenceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDensity",
          label: "Supplied Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceVolumeScale",
          label: "Source Volume Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceVolume",
          label: "Reference Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
        {
          id: "referenceRatio",
          label: "Reference Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = essentialOilReferenceVolumeFactorTool.execute;
export default essentialOilReferenceVolumeFactorTool;

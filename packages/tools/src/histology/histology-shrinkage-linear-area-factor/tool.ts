import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearRetention: number;
  readonly observedArea: number;
  readonly observedVolume: number;
};
export type Output = {
  readonly areaRetention: number;
  readonly volumeRetention: number;
  readonly originalArea: number;
  readonly originalVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearRetention: { type: "number", exclusiveMinimum: 0 },
    observedArea: { type: "number", minimum: 0 },
    observedVolume: { type: "number", minimum: 0 },
  },
  required: ["linearRetention", "observedArea", "observedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaRetention: { type: "number" },
    volumeRetention: { type: "number" },
    originalArea: { type: "number" },
    originalVolume: { type: "number" },
  },
  required: [
    "areaRetention",
    "volumeRetention",
    "originalArea",
    "originalVolume",
  ],
} as const;
/** Isotropic linear retention supplied by the caller; area and volume corrections do not estimate processing shrinkage. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { linearRetention, observedArea, observedVolume } = request;
  const compute = (): Output => {
    H.positive(linearRetention);
    H.domain(observedArea >= 0 && observedVolume >= 0);
    return {
      areaRetention: linearRetention ** 2,
      volumeRetention: linearRetention ** 3,
      originalArea: observedArea / linearRetention ** 2,
      originalVolume: observedVolume / linearRetention ** 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { linearRetention: 0.8, observedArea: 64, observedVolume: 512 },
  output: {
    areaRetention: 0.6400000000000001,
    volumeRetention: 0.5120000000000001,
    originalArea: 99.99999999999999,
    originalVolume: 999.9999999999998,
  },
} satisfies ToolExample<Input, Output>;
export const histologyShrinkageLinearAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/histology-shrinkage-linear-area-factor",
    title: "Histology Shrinkage Linear Area Factor Tool",
    description:
      "Isotropic linear retention supplied by the caller; area and volume corrections do not estimate processing shrinkage.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearRetention: { type: "number", exclusiveMinimum: 0 },
        observedArea: { type: "number", minimum: 0 },
        observedVolume: { type: "number", minimum: 0 },
      },
      required: ["linearRetention", "observedArea", "observedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaRetention: { type: "number" },
        volumeRetention: { type: "number" },
        originalArea: { type: "number" },
        originalVolume: { type: "number" },
      },
      required: [
        "areaRetention",
        "volumeRetention",
        "originalArea",
        "originalVolume",
      ],
    },
    ports: {
      inputs: [
        {
          id: "linearRetention",
          label: "Linear Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedArea",
          label: "Observed Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedVolume",
          label: "Observed Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaRetention",
          label: "Area Retention",
          valueType: { type: "number" },
        },
        {
          id: "volumeRetention",
          label: "Volume Retention",
          valueType: { type: "number" },
        },
        {
          id: "originalArea",
          label: "Original Area",
          valueType: { type: "number" },
        },
        {
          id: "originalVolume",
          label: "Original Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = histologyShrinkageLinearAreaFactorTool.execute;
export default histologyShrinkageLinearAreaFactorTool;

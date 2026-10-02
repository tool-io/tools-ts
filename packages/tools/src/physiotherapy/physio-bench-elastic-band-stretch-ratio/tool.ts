import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restLength: number;
  readonly loadedLength: number;
  readonly referenceLength: number;
  readonly force: number;
};
export type Output = {
  readonly stretchRatio: number;
  readonly engineeringStrain: number;
  readonly forcePerReferenceLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restLength: { type: "number", exclusiveMinimum: 0 },
    loadedLength: { type: "number", minimum: 0 },
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    force: { type: "number" },
  },
  required: ["restLength", "loadedLength", "referenceLength", "force"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stretchRatio: { type: "number" },
    engineeringStrain: { type: "number" },
    forcePerReferenceLength: { type: "number" },
  },
  required: ["stretchRatio", "engineeringStrain", "forcePerReferenceLength"],
} as const;
/** Supplied bench extension and normalized force, without a band resistance lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restLength, loadedLength, referenceLength, force } = request;
  const compute = (): Output => {
    H.positive(restLength);
    H.positive(referenceLength);
    H.domain(loadedLength >= 0);
    return {
      stretchRatio: loadedLength / restLength,
      engineeringStrain: (loadedLength - restLength) / restLength,
      forcePerReferenceLength: force / referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { restLength: 50, loadedLength: 75, referenceLength: 10, force: 20 },
  output: {
    stretchRatio: 1.5,
    engineeringStrain: 0.5,
    forcePerReferenceLength: 2,
  },
} satisfies ToolExample<Input, Output>;
export const physioBenchElasticBandStretchRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/physio-bench-elastic-band-stretch-ratio",
    title: "Physio Bench Elastic Band Stretch Ratio Tool",
    description:
      "Supplied bench extension and normalized force, without a band resistance lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        restLength: { type: "number", exclusiveMinimum: 0 },
        loadedLength: { type: "number", minimum: 0 },
        referenceLength: { type: "number", exclusiveMinimum: 0 },
        force: { type: "number" },
      },
      required: ["restLength", "loadedLength", "referenceLength", "force"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stretchRatio: { type: "number" },
        engineeringStrain: { type: "number" },
        forcePerReferenceLength: { type: "number" },
      },
      required: [
        "stretchRatio",
        "engineeringStrain",
        "forcePerReferenceLength",
      ],
    },
    ports: {
      inputs: [
        {
          id: "restLength",
          label: "Rest Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadedLength",
          label: "Loaded Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "force",
          label: "Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stretchRatio",
          label: "Stretch Ratio",
          valueType: { type: "number" },
        },
        {
          id: "engineeringStrain",
          label: "Engineering Strain",
          valueType: { type: "number" },
        },
        {
          id: "forcePerReferenceLength",
          label: "Force Per Reference Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = physioBenchElasticBandStretchRatioTool.execute;
export default physioBenchElasticBandStretchRatioTool;

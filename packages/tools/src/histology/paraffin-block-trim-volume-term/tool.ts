import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly faceWidth: number;
  readonly faceHeight: number;
  readonly trimDepth: number;
  readonly tissueFraction: number;
};
export type Output = {
  readonly removedVolume: number;
  readonly estimatedTissueVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceWidth: { type: "number", minimum: 0 },
    faceHeight: { type: "number", minimum: 0 },
    trimDepth: { type: "number", minimum: 0 },
    tissueFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["faceWidth", "faceHeight", "trimDepth", "tissueFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    removedVolume: { type: "number" },
    estimatedTissueVolume: { type: "number" },
  },
  required: ["removedVolume", "estimatedTissueVolume"],
} as const;
/** Rectangular trim-slab volume and an explicitly supplied tissue-volume fraction, not a cutting-depth recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { faceWidth, faceHeight, trimDepth, tissueFraction } = request;
  const compute = (): Output => {
    H.domain(faceWidth >= 0 && faceHeight >= 0 && trimDepth >= 0);
    H.probability(tissueFraction);
    return {
      removedVolume: faceWidth * faceHeight * trimDepth,
      estimatedTissueVolume:
        faceWidth * faceHeight * trimDepth * tissueFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { faceWidth: 10, faceHeight: 8, trimDepth: 0.5, tissueFraction: 0.2 },
  output: { removedVolume: 40, estimatedTissueVolume: 8 },
} satisfies ToolExample<Input, Output>;
export const paraffinBlockTrimVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/paraffin-block-trim-volume-term",
    title: "Paraffin Block Trim Volume Term Tool",
    description:
      "Rectangular trim-slab volume and an explicitly supplied tissue-volume fraction, not a cutting-depth recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        faceWidth: { type: "number", minimum: 0 },
        faceHeight: { type: "number", minimum: 0 },
        trimDepth: { type: "number", minimum: 0 },
        tissueFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["faceWidth", "faceHeight", "trimDepth", "tissueFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        removedVolume: { type: "number" },
        estimatedTissueVolume: { type: "number" },
      },
      required: ["removedVolume", "estimatedTissueVolume"],
    },
    ports: {
      inputs: [
        {
          id: "faceWidth",
          label: "Face Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "faceHeight",
          label: "Face Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trimDepth",
          label: "Trim Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tissueFraction",
          label: "Tissue Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "removedVolume",
          label: "Removed Volume",
          valueType: { type: "number" },
        },
        {
          id: "estimatedTissueVolume",
          label: "Estimated Tissue Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = paraffinBlockTrimVolumeTermTool.execute;
export default paraffinBlockTrimVolumeTermTool;

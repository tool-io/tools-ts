import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly casingInternalRadius: number;
  readonly waterColumnHeight: number;
  readonly suppliedCasingVolumes: number;
};
export type Output = {
  readonly oneCasingVolume: number;
  readonly purgeVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    casingInternalRadius: { type: "number", minimum: 0 },
    waterColumnHeight: { type: "number", minimum: 0 },
    suppliedCasingVolumes: { type: "number", minimum: 0 },
  },
  required: [
    "casingInternalRadius",
    "waterColumnHeight",
    "suppliedCasingVolumes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneCasingVolume: { type: "number" },
    purgeVolume: { type: "number" },
  },
  required: ["oneCasingVolume", "purgeVolume"],
} as const;
/** Multiply ideal cylindrical casing water volume by an explicitly supplied purge-volume count without prescribing a groundwater sampling protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { casingInternalRadius, waterColumnHeight, suppliedCasingVolumes } =
    request;
  const compute = (): Output => {
    H.domain(casingInternalRadius >= 0, "casingInternalRadius");
    H.domain(waterColumnHeight >= 0, "waterColumnHeight");
    H.domain(suppliedCasingVolumes >= 0, "suppliedCasingVolumes");
    return {
      oneCasingVolume:
        Math.PI *
        casingInternalRadius *
        casingInternalRadius *
        waterColumnHeight,
      purgeVolume:
        Math.PI *
        casingInternalRadius *
        casingInternalRadius *
        waterColumnHeight *
        suppliedCasingVolumes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    casingInternalRadius: 1,
    waterColumnHeight: 2,
    suppliedCasingVolumes: 3,
  },
  output: {
    oneCasingVolume: 6.283185307179586,
    purgeVolume: 18.84955592153876,
  },
} satisfies ToolExample<Input, Output>;
export const groundwaterSamplingPurgeVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/groundwater-sampling-purge-volume-term",
    title: "Groundwater Sampling Purge Volume Term Tool",
    description:
      "Multiply ideal cylindrical casing water volume by an explicitly supplied purge-volume count without prescribing a groundwater sampling protocol.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        casingInternalRadius: { type: "number", minimum: 0 },
        waterColumnHeight: { type: "number", minimum: 0 },
        suppliedCasingVolumes: { type: "number", minimum: 0 },
      },
      required: [
        "casingInternalRadius",
        "waterColumnHeight",
        "suppliedCasingVolumes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oneCasingVolume: { type: "number" },
        purgeVolume: { type: "number" },
      },
      required: ["oneCasingVolume", "purgeVolume"],
    },
    ports: {
      inputs: [
        {
          id: "casingInternalRadius",
          label: "Casing Internal Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterColumnHeight",
          label: "Water Column Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCasingVolumes",
          label: "Supplied Casing Volumes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oneCasingVolume",
          label: "One Casing Volume",
          valueType: { type: "number" },
        },
        {
          id: "purgeVolume",
          label: "Purge Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groundwaterSamplingPurgeVolumeTermTool.execute;
export default groundwaterSamplingPurgeVolumeTermTool;

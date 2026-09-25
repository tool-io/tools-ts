import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionWidthPixels: number;
  readonly regionHeightPixels: number;
  readonly targetWidth: number;
  readonly targetHeight: number;
};
export type Output = {
  readonly widthGap: number;
  readonly heightGap: number;
  readonly meetsBoth: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionWidthPixels: { type: "integer", minimum: 0 },
    regionHeightPixels: { type: "integer", minimum: 0 },
    targetWidth: { type: "integer", minimum: 0 },
    targetHeight: { type: "integer", minimum: 0 },
  },
  required: [
    "regionWidthPixels",
    "regionHeightPixels",
    "targetWidth",
    "targetHeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    widthGap: { type: "integer" },
    heightGap: { type: "integer" },
    meetsBoth: { type: "boolean" },
  },
  required: ["widthGap", "heightGap", "meetsBoth"],
} as const;
/** Compare supplied research-image dimensions with explicit targets; no image analysis or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionWidthPixels, regionHeightPixels, targetWidth, targetHeight } =
    request;
  const compute = (): Output => {
    H.integer(regionWidthPixels, 0);
    H.integer(regionHeightPixels, 0);
    H.integer(targetWidth, 0);
    H.integer(targetHeight, 0);
    return {
      widthGap: regionWidthPixels - targetWidth,
      heightGap: regionHeightPixels - targetHeight,
      meetsBoth:
        regionWidthPixels >= targetWidth && regionHeightPixels >= targetHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionWidthPixels: 120,
    regionHeightPixels: 80,
    targetWidth: 100,
    targetHeight: 100,
  },
  output: { widthGap: 20, heightGap: -20, meetsBoth: false },
} satisfies ToolExample<Input, Output>;
export const skinImageRegionResolutionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/skin-image-region-resolution-gap",
    title: "Skin Image Region Resolution Gap Tool",
    description:
      "Compare supplied research-image dimensions with explicit targets; no image analysis or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionWidthPixels: { type: "integer", minimum: 0 },
        regionHeightPixels: { type: "integer", minimum: 0 },
        targetWidth: { type: "integer", minimum: 0 },
        targetHeight: { type: "integer", minimum: 0 },
      },
      required: [
        "regionWidthPixels",
        "regionHeightPixels",
        "targetWidth",
        "targetHeight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        widthGap: { type: "integer" },
        heightGap: { type: "integer" },
        meetsBoth: { type: "boolean" },
      },
      required: ["widthGap", "heightGap", "meetsBoth"],
    },
    ports: {
      inputs: [
        {
          id: "regionWidthPixels",
          label: "Region Width Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "regionHeightPixels",
          label: "Region Height Pixels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetWidth",
          label: "Target Width",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetHeight",
          label: "Target Height",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "widthGap", label: "Width Gap", valueType: { type: "integer" } },
        {
          id: "heightGap",
          label: "Height Gap",
          valueType: { type: "integer" },
        },
        {
          id: "meetsBoth",
          label: "Meets Both",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = skinImageRegionResolutionGapTool.execute;
export default skinImageRegionResolutionGapTool;

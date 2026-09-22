import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imageDistance: number;
  readonly referencePixels: number;
  readonly referenceLength: number;
  readonly suppliedPhysicalDistance: number;
};
export type Output = {
  readonly scaledDistance: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imageDistance: { type: "number", minimum: 0 },
    referencePixels: { type: "number", exclusiveMinimum: 0 },
    referenceLength: { type: "number", minimum: 0 },
    suppliedPhysicalDistance: { type: "number", minimum: 0 },
  },
  required: [
    "imageDistance",
    "referencePixels",
    "referenceLength",
    "suppliedPhysicalDistance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaledDistance: { type: "number" },
    residual: { type: "number" },
  },
  required: ["scaledDistance", "residual"],
} as const;
/** Compare supplied condition-image scale measurements without identifying damage or advising treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    imageDistance,
    referencePixels,
    referenceLength,
    suppliedPhysicalDistance,
  } = request;
  const compute = (): Output => {
    H.positive(referencePixels);
    H.domain(
      imageDistance >= 0 &&
        referenceLength >= 0 &&
        suppliedPhysicalDistance >= 0,
    );
    return {
      scaledDistance: (imageDistance * referenceLength) / referencePixels,
      residual:
        (imageDistance * referenceLength) / referencePixels -
        suppliedPhysicalDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    imageDistance: 40,
    referencePixels: 20,
    referenceLength: 5,
    suppliedPhysicalDistance: 9,
  },
  output: { scaledDistance: 10, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const conditionImageScaleResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/condition-image-scale-residual",
    title: "Condition Image Scale Residual Tool",
    description:
      "Compare supplied condition-image scale measurements without identifying damage or advising treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        imageDistance: { type: "number", minimum: 0 },
        referencePixels: { type: "number", exclusiveMinimum: 0 },
        referenceLength: { type: "number", minimum: 0 },
        suppliedPhysicalDistance: { type: "number", minimum: 0 },
      },
      required: [
        "imageDistance",
        "referencePixels",
        "referenceLength",
        "suppliedPhysicalDistance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaledDistance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["scaledDistance", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "imageDistance",
          label: "Image Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePixels",
          label: "Reference Pixels",
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
          id: "suppliedPhysicalDistance",
          label: "Supplied Physical Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "scaledDistance",
          label: "Scaled Distance",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = conditionImageScaleResidualTool.execute;
export default conditionImageScaleResidualTool;

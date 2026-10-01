import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cameraDistance: number;
  readonly pointDepth: number;
  readonly referenceDepth: number;
  readonly referenceScale: number;
};
export type Output = {
  readonly relativeScale: number;
  readonly correctedLengthFactor: number;
  readonly depthGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cameraDistance: { type: "number" },
    pointDepth: { type: "number" },
    referenceDepth: { type: "number" },
    referenceScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "cameraDistance",
    "pointDepth",
    "referenceDepth",
    "referenceScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeScale: { type: "number" },
    correctedLengthFactor: { type: "number" },
    depthGap: { type: "number" },
  },
  required: ["relativeScale", "correctedLengthFactor", "depthGap"],
} as const;
/** Pinhole out-of-plane photo scale error relative to an explicit reference plane. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cameraDistance, pointDepth, referenceDepth, referenceScale } =
    request;
  const compute = (): Output => {
    H.domain(cameraDistance > pointDepth && cameraDistance > referenceDepth);
    H.positive(referenceScale);
    return {
      relativeScale:
        (cameraDistance - referenceDepth) / (cameraDistance - pointDepth),
      correctedLengthFactor:
        (referenceScale * (cameraDistance - pointDepth)) /
        (cameraDistance - referenceDepth),
      depthGap: pointDepth - referenceDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cameraDistance: 100,
    pointDepth: 20,
    referenceDepth: 0,
    referenceScale: 1,
  },
  output: { relativeScale: 1.25, correctedLengthFactor: 0.8, depthGap: 20 },
} satisfies ToolExample<Input, Output>;
export const orthodonticPhotoReferencePlaneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/orthodontic-photo-reference-plane-gap",
    title: "Orthodontic Photo Reference Plane Gap Tool",
    description:
      "Pinhole out-of-plane photo scale error relative to an explicit reference plane.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cameraDistance: { type: "number" },
        pointDepth: { type: "number" },
        referenceDepth: { type: "number" },
        referenceScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "cameraDistance",
        "pointDepth",
        "referenceDepth",
        "referenceScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeScale: { type: "number" },
        correctedLengthFactor: { type: "number" },
        depthGap: { type: "number" },
      },
      required: ["relativeScale", "correctedLengthFactor", "depthGap"],
    },
    ports: {
      inputs: [
        {
          id: "cameraDistance",
          label: "Camera Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pointDepth",
          label: "Point Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDepth",
          label: "Reference Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceScale",
          label: "Reference Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeScale",
          label: "Relative Scale",
          valueType: { type: "number" },
        },
        {
          id: "correctedLengthFactor",
          label: "Corrected Length Factor",
          valueType: { type: "number" },
        },
        { id: "depthGap", label: "Depth Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orthodonticPhotoReferencePlaneGapTool.execute;
export default orthodonticPhotoReferencePlaneGapTool;

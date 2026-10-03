import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDetectorDistance: number;
  readonly sourceObjectDistance: number;
  readonly measuredImageLength: number;
};
export type Output = {
  readonly magnification: number;
  readonly objectLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDetectorDistance: { type: "number", exclusiveMinimum: 0 },
    sourceObjectDistance: { type: "number", exclusiveMinimum: 0 },
    measuredImageLength: { type: "number", minimum: 0 },
  },
  required: [
    "sourceDetectorDistance",
    "sourceObjectDistance",
    "measuredImageLength",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    magnification: { type: "number" },
    objectLength: { type: "number" },
  },
  required: ["magnification", "objectLength"],
} as const;
/** Ideal projection magnification using matched source-object and source-detector distances, excluding perspective tilt and detector distortion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceDetectorDistance, sourceObjectDistance, measuredImageLength } =
    request;
  const compute = (): Output => {
    H.positive(sourceDetectorDistance);
    H.positive(sourceObjectDistance);
    H.domain(
      sourceObjectDistance <= sourceDetectorDistance &&
        measuredImageLength >= 0,
    );
    return {
      magnification: sourceDetectorDistance / sourceObjectDistance,
      objectLength:
        (measuredImageLength * sourceObjectDistance) / sourceDetectorDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceDetectorDistance: 100,
    sourceObjectDistance: 80,
    measuredImageLength: 25,
  },
  output: { magnification: 1.25, objectLength: 20 },
} satisfies ToolExample<Input, Output>;
export const radiologyGeometricMagnificationSimilarTriangleTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "radiology/radiology-geometric-magnification-similar-triangle-term",
      title: "Radiology Geometric Magnification Similar Triangle Term Tool",
      description:
        "Ideal projection magnification using matched source-object and source-detector distances, excluding perspective tilt and detector distortion.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceDetectorDistance: { type: "number", exclusiveMinimum: 0 },
          sourceObjectDistance: { type: "number", exclusiveMinimum: 0 },
          measuredImageLength: { type: "number", minimum: 0 },
        },
        required: [
          "sourceDetectorDistance",
          "sourceObjectDistance",
          "measuredImageLength",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          magnification: { type: "number" },
          objectLength: { type: "number" },
        },
        required: ["magnification", "objectLength"],
      },
      ports: {
        inputs: [
          {
            id: "sourceDetectorDistance",
            label: "Source Detector Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceObjectDistance",
            label: "Source Object Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredImageLength",
            label: "Measured Image Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "magnification",
            label: "Magnification",
            valueType: { type: "number" },
          },
          {
            id: "objectLength",
            label: "Object Length",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run =
  radiologyGeometricMagnificationSimilarTriangleTermTool.execute;
export default radiologyGeometricMagnificationSimilarTriangleTermTool;

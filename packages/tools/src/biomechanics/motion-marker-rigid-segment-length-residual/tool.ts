import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMarker: readonly number[];
  readonly secondMarker: readonly number[];
  readonly referenceLength: number;
};
export type Output = {
  readonly measuredLength: number;
  readonly lengthResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMarker: { type: "array", maxItems: 256, items: { type: "number" } },
    secondMarker: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceLength: { type: "number", minimum: 0 },
  },
  required: ["firstMarker", "secondMarker", "referenceLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLength: { type: "number" },
    lengthResidual: { type: "number" },
  },
  required: ["measuredLength", "lengthResidual"],
} as const;
/** Compare Euclidean distance between supplied aligned marker coordinates with an explicit rigid-segment reference length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstMarker, secondMarker, referenceLength } = request;
  const compute = (): Output => {
    H.domain(firstMarker.length > 0, "firstMarker");
    H.domain(firstMarker.length === secondMarker.length, "secondMarker");
    H.domain(referenceLength >= 0, "referenceLength");
    return (() => {
      const measuredLength = Math.hypot(
        ...firstMarker.map((value, index) => value - secondMarker[index]),
      );
      return {
        measuredLength,
        lengthResidual: measuredLength - referenceLength,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstMarker: [0, 0, 0],
    secondMarker: [3, 4, 0],
    referenceLength: 4,
  },
  output: { measuredLength: 5, lengthResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const motionMarkerRigidSegmentLengthResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biomechanics", "engineering"],
        keywords: ["biomechanics", "engineering"],
      },
      id: "biomechanics/motion-marker-rigid-segment-length-residual",
      title: "Motion Marker Rigid Segment Length Residual",
      description:
        "Compare Euclidean distance between supplied aligned marker coordinates with an explicit rigid-segment reference length.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstMarker: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          secondMarker: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          referenceLength: { type: "number", minimum: 0 },
        },
        required: ["firstMarker", "secondMarker", "referenceLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredLength: { type: "number" },
          lengthResidual: { type: "number" },
        },
        required: ["measuredLength", "lengthResidual"],
      },
      ports: {
        inputs: [
          {
            id: "firstMarker",
            label: "First Marker",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "secondMarker",
            label: "Second Marker",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "referenceLength",
            label: "Reference Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "measuredLength",
            label: "Measured Length",
            valueType: { type: "number" },
          },
          {
            id: "lengthResidual",
            label: "Length Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = motionMarkerRigidSegmentLengthResidualTool.execute;
export default motionMarkerRigidSegmentLengthResidualTool;

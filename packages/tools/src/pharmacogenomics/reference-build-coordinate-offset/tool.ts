import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly sourceOrigin: number;
  readonly targetOrigin: number;
  readonly sourceBuild: string;
  readonly targetBuild: string;
  readonly mappingVerified: boolean;
};
export type Output = {
  readonly mappedCoordinateDecimal: string;
  readonly source: string;
  readonly target: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "integer" },
    sourceOrigin: { type: "integer" },
    targetOrigin: { type: "integer" },
    sourceBuild: { type: "string", maxLength: 8192 },
    targetBuild: { type: "string", maxLength: 8192 },
    mappingVerified: { type: "boolean" },
  },
  required: [
    "coordinate",
    "sourceOrigin",
    "targetOrigin",
    "sourceBuild",
    "targetBuild",
    "mappingVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappedCoordinateDecimal: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
  },
  required: ["mappedCoordinateDecimal", "source", "target"],
} as const;
/** Apply a caller-verified local coordinate offset with explicit build labels; this is not a genome liftover algorithm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    coordinate,
    sourceOrigin,
    targetOrigin,
    sourceBuild,
    targetBuild,
    mappingVerified,
  } = request;
  const compute = (): Output => {
    H.domain(
      mappingVerified && sourceBuild.length > 0 && targetBuild.length > 0,
    );
    return {
      mappedCoordinateDecimal: (
        BigInt(coordinate) -
        BigInt(sourceOrigin) +
        BigInt(targetOrigin)
      ).toString(),
      source: sourceBuild,
      target: targetBuild,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coordinate: 120,
    sourceOrigin: 100,
    targetOrigin: 200,
    sourceBuild: "A",
    targetBuild: "B",
    mappingVerified: true,
  },
  output: { mappedCoordinateDecimal: "220", source: "A", target: "B" },
} satisfies ToolExample<Input, Output>;
export const referenceBuildCoordinateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/reference-build-coordinate-offset",
    title: "Reference Build Coordinate Offset Tool",
    description:
      "Apply a caller-verified local coordinate offset with explicit build labels; this is not a genome liftover algorithm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "integer" },
        sourceOrigin: { type: "integer" },
        targetOrigin: { type: "integer" },
        sourceBuild: { type: "string", maxLength: 8192 },
        targetBuild: { type: "string", maxLength: 8192 },
        mappingVerified: { type: "boolean" },
      },
      required: [
        "coordinate",
        "sourceOrigin",
        "targetOrigin",
        "sourceBuild",
        "targetBuild",
        "mappingVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mappedCoordinateDecimal: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        target: { type: "string", maxLength: 8192 },
      },
      required: ["mappedCoordinateDecimal", "source", "target"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceOrigin",
          label: "Source Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetOrigin",
          label: "Target Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceBuild",
          label: "Source Build",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetBuild",
          label: "Target Build",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "mappingVerified",
          label: "Mapping Verified",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "mappedCoordinateDecimal",
          label: "Mapped Coordinate Decimal",
          valueType: { type: "string" },
        },
        { id: "source", label: "Source", valueType: { type: "string" } },
        { id: "target", label: "Target", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = referenceBuildCoordinateOffsetTool.execute;
export default referenceBuildCoordinateOffsetTool;

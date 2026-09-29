import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetX: number;
  readonly targetY: number;
  readonly centerX: number;
  readonly centerY: number;
  readonly xRadius: number;
  readonly yRadius: number;
};
export type Output = {
  readonly ellipseCoordinate: number;
  readonly insideSuppliedEnvelope: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetX: { type: "number" },
    targetY: { type: "number" },
    centerX: { type: "number" },
    centerY: { type: "number" },
    xRadius: { type: "number", exclusiveMinimum: 0 },
    yRadius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["targetX", "targetY", "centerX", "centerY", "xRadius", "yRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ellipseCoordinate: { type: "number" },
    insideSuppliedEnvelope: { type: "boolean" },
  },
  required: ["ellipseCoordinate", "insideSuppliedEnvelope"],
} as const;
/** Point inclusion in a supplied planar elliptical reach envelope, without an anthropometric norm or ergonomic safety assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetX, targetY, centerX, centerY, xRadius, yRadius } = request;
  const compute = (): Output => {
    H.positive(xRadius);
    H.positive(yRadius);
    return {
      ellipseCoordinate:
        ((targetX - centerX) / xRadius) ** 2 +
        ((targetY - centerY) / yRadius) ** 2,
      insideSuppliedEnvelope:
        ((targetX - centerX) / xRadius) ** 2 +
          ((targetY - centerY) / yRadius) ** 2 <=
        1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    targetX: 3,
    targetY: 0,
    centerX: 0,
    centerY: 0,
    xRadius: 4,
    yRadius: 2,
  },
  output: { ellipseCoordinate: 0.5625, insideSuppliedEnvelope: true },
} satisfies ToolExample<Input, Output>;
export const ergonomicReachEnvelopeExplicitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/ergonomic-reach-envelope-explicit-gap",
    title: "Ergonomic Reach Envelope Explicit Gap Tool",
    description:
      "Point inclusion in a supplied planar elliptical reach envelope, without an anthropometric norm or ergonomic safety assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetX: { type: "number" },
        targetY: { type: "number" },
        centerX: { type: "number" },
        centerY: { type: "number" },
        xRadius: { type: "number", exclusiveMinimum: 0 },
        yRadius: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "targetX",
        "targetY",
        "centerX",
        "centerY",
        "xRadius",
        "yRadius",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ellipseCoordinate: { type: "number" },
        insideSuppliedEnvelope: { type: "boolean" },
      },
      required: ["ellipseCoordinate", "insideSuppliedEnvelope"],
    },
    ports: {
      inputs: [
        {
          id: "targetX",
          label: "Target X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetY",
          label: "Target Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerX",
          label: "Center X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerY",
          label: "Center Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "xRadius",
          label: "X Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yRadius",
          label: "Y Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ellipseCoordinate",
          label: "Ellipse Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "insideSuppliedEnvelope",
          label: "Inside Supplied Envelope",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = ergonomicReachEnvelopeExplicitGapTool.execute;
export default ergonomicReachEnvelopeExplicitGapTool;

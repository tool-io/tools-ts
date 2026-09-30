import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
  readonly leftTangent: number;
  readonly rightTangent: number;
  readonly tangentsAreParameterDerivatives: boolean;
  readonly rightEndpoint: boolean;
  readonly suppliedSlope: number;
};
export type Output = {
  readonly segmentSlope: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x0: { type: "number" },
    x1: { type: "number" },
    y0: { type: "number" },
    y1: { type: "number" },
    leftTangent: { type: "number" },
    rightTangent: { type: "number" },
    tangentsAreParameterDerivatives: { type: "boolean" },
    rightEndpoint: { type: "boolean" },
    suppliedSlope: { type: "number" },
  },
  required: [
    "x0",
    "x1",
    "y0",
    "y1",
    "leftTangent",
    "rightTangent",
    "tangentsAreParameterDerivatives",
    "rightEndpoint",
    "suppliedSlope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentSlope: { type: "number" },
    residual: { type: "number" },
  },
  required: ["segmentSlope", "residual"],
} as const;
/** Compare one Hermite endpoint derivative to a supplied slope, resolving derivatives with respect to normalized segment parameter versus x. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    x0,
    x1,
    y0,
    y1,
    leftTangent,
    rightTangent,
    tangentsAreParameterDerivatives,
    rightEndpoint,
    suppliedSlope,
  } = request;
  const compute = (): Output => {
    H.domain(x0 !== x1);
    const h = x1 - x0;
    H.finite((y1 - y0) / h);
    const tangent = rightEndpoint ? rightTangent : leftTangent,
      segmentSlope = tangentsAreParameterDerivatives ? tangent / h : tangent;
    return { segmentSlope, residual: segmentSlope - suppliedSlope };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    x0: 0,
    x1: 2,
    y0: 1,
    y1: 5,
    leftTangent: 4,
    rightTangent: 8,
    tangentsAreParameterDerivatives: true,
    rightEndpoint: true,
    suppliedSlope: 3,
  },
  output: { segmentSlope: 4, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const hermiteEndpointSlopeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/hermite-endpoint-slope-residual",
    title: "Hermite Endpoint Slope Residual Tool",
    description:
      "Compare one Hermite endpoint derivative to a supplied slope, resolving derivatives with respect to normalized segment parameter versus x.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x0: { type: "number" },
        x1: { type: "number" },
        y0: { type: "number" },
        y1: { type: "number" },
        leftTangent: { type: "number" },
        rightTangent: { type: "number" },
        tangentsAreParameterDerivatives: { type: "boolean" },
        rightEndpoint: { type: "boolean" },
        suppliedSlope: { type: "number" },
      },
      required: [
        "x0",
        "x1",
        "y0",
        "y1",
        "leftTangent",
        "rightTangent",
        "tangentsAreParameterDerivatives",
        "rightEndpoint",
        "suppliedSlope",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentSlope: { type: "number" },
        residual: { type: "number" },
      },
      required: ["segmentSlope", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "x0",
          label: "X0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "x1",
          label: "X1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y0",
          label: "Y0",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "y1",
          label: "Y1",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftTangent",
          label: "Left Tangent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightTangent",
          label: "Right Tangent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tangentsAreParameterDerivatives",
          label: "Tangents Are Parameter Derivatives",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "rightEndpoint",
          label: "Right Endpoint",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedSlope",
          label: "Supplied Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "segmentSlope",
          label: "Segment Slope",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hermiteEndpointSlopeResidualTool.execute;
export default hermiteEndpointSlopeResidualTool;

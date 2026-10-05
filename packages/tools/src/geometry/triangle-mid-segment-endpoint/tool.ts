import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vertexX: number;
  readonly vertexY: number;
  readonly neighborX: number;
  readonly neighborY: number;
};
export type Output = { readonly midpointX: number; readonly midpointY: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vertexX: { type: "number" },
    vertexY: { type: "number" },
    neighborX: { type: "number" },
    neighborY: { type: "number" },
  },
  required: ["vertexX", "vertexY", "neighborX", "neighborY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpointX: { type: "number" }, midpointY: { type: "number" } },
  required: ["midpointX", "midpointY"],
} as const;
/** Return one triangle midsegment endpoint as the midpoint of its specified side. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vertexX, vertexY, neighborX, neighborY } = request;
  const compute = (): Output => {
    return {
      midpointX: vertexX / 2 + neighborX / 2,
      midpointY: vertexY / 2 + neighborY / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vertexX: 2, vertexY: 4, neighborX: 8, neighborY: 10 },
  output: { midpointX: 5, midpointY: 7 },
} satisfies ToolExample<Input, Output>;
export const triangleMidSegmentEndpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/triangle-mid-segment-endpoint",
    title: "Triangle Mid Segment Endpoint Tool",
    description:
      "Return one triangle midsegment endpoint as the midpoint of its specified side.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vertexX: { type: "number" },
        vertexY: { type: "number" },
        neighborX: { type: "number" },
        neighborY: { type: "number" },
      },
      required: ["vertexX", "vertexY", "neighborX", "neighborY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpointX: { type: "number" },
        midpointY: { type: "number" },
      },
      required: ["midpointX", "midpointY"],
    },
    ports: {
      inputs: [
        {
          id: "vertexX",
          label: "Vertex X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vertexY",
          label: "Vertex Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "neighborX",
          label: "Neighbor X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "neighborY",
          label: "Neighbor Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpointX", label: "Midpoint X", valueType: { type: "number" } },
        { id: "midpointY", label: "Midpoint Y", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = triangleMidSegmentEndpointTool.execute;
export default triangleMidSegmentEndpointTool;

import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleCoordinate: number;
  readonly edgeCoordinate: number;
  readonly reverseAxis: boolean;
  readonly suppliedScale: number;
};
export type Output = { readonly signedOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleCoordinate: { type: "number" },
    edgeCoordinate: { type: "number" },
    reverseAxis: { type: "boolean" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleCoordinate",
    "edgeCoordinate",
    "reverseAxis",
    "suppliedScale",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedOffset: { type: "number" } },
  required: ["signedOffset"],
} as const;
/** Resolve a supplied sample-location offset from an explicit edge and axis convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleCoordinate, edgeCoordinate, reverseAxis, suppliedScale } =
    request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      signedOffset:
        (sampleCoordinate - edgeCoordinate) *
        (reverseAxis ? -1 : 1) *
        suppliedScale,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleCoordinate: 12,
    edgeCoordinate: 5,
    reverseAxis: false,
    suppliedScale: 0.5,
  },
  output: { signedOffset: 3.5 },
} satisfies ToolExample<Input, Output>;
export const sampleLocationEdgeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/sample-location-edge-offset",
    title: "Sample Location Edge Offset Tool",
    description:
      "Resolve a supplied sample-location offset from an explicit edge and axis convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleCoordinate: { type: "number" },
        edgeCoordinate: { type: "number" },
        reverseAxis: { type: "boolean" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sampleCoordinate",
        "edgeCoordinate",
        "reverseAxis",
        "suppliedScale",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedOffset: { type: "number" } },
      required: ["signedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "sampleCoordinate",
          label: "Sample Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeCoordinate",
          label: "Edge Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleLocationEdgeOffsetTool.execute;
export default sampleLocationEdgeOffsetTool;
